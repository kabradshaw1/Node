import { UserModel, User } from '../models/User';
import  resolvers  from './resolvers';
import { AuthenticationError } from "apollo-server-express";
import mockingoose from 'mockingoose';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { Context } from './resolvers';
import { EventModel } from '../models/Event';
import { mock, MockProxy } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Mock of a valid authenticated admin user
const mockAdminUser = {
  isAdmin: jest.fn().mockReturnValue(true),
};

let mongod: MongoMemoryServer;
let context: Context & MockProxy<Context>;
beforeAll(async () => {
  mongod = new MongoMemoryServer();
  const uri = await mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  context = mock<Context>();
  context.s3 = new AWS.S3();
  AWSMock.setSDKInstance(AWS);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
  AWSMock.restore('S3');
});

beforeEach(() => {
  context.user = mockAdminUser;
});

// Test case 1: Admin user with a file
it('should add an event with a file for an admin user', async () => {
  const eventArgs = {
    file: mockFile,
    title: 'Test Event',
    description: 'Test Description',
    date: new Date(),
  };

  AWSMock.mock('S3', 'putObject', (params, callback) => {
    callback(null, { Location: 'https://example.com/testfile.txt' });
  });

  const event = await addEvent(null, eventArgs, context);

  expect(event).toMatchObject({
    title: 'Test Event',
    description: 'Test Description',
    file: expect.any(String),
    date: eventArgs.date,
  });
});
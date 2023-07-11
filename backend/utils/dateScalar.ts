import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    } else {
      throw new Error('Expected a Date');
    }
  },
  parseValue(value: unknown): Date {
    if (typeof value === 'number') {
      return new Date(value);
    } else {
      throw new Error('Expected a Unix timestamp (number)');
    }
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export default dateScalar;
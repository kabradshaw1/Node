const Logo: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '400px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <img
        src={`/images/TRICYPAA_LOGO.png`}
        alt="Logo"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  )
}

export default Logo;

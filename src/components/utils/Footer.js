
const footerStyle = {
  backgroundColor: "#1876d2",
  fontSize: "14px",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "10px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "40px",
  width: "100%"
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "100%"
};

function Footer() {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>
        &copy; 2021-{new Date().getFullYear()} Politiquices.PT
        <span style={{ marginLeft: '20px' }}/>
          <a href="https://github.com/politiquices" style={{ color: 'white', textDecoration: 'none'}} target="_blank" rel="noreferrer">GitHub</a>
        <span style={{ marginLeft: '20px' }}/>
          <a href="https://www.davidsbatista.net/assets/documents/publications/politiquices_dsbatista_20230705.pdf" 
          style={{ color: 'white', textDecoration: 'none' }}  target="_blank" rel="noreferrer">Relatório</a>
        </div>
    </div>
  );
}
export default Footer;
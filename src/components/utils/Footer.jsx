import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>
        &copy; 2021-{new Date().getFullYear()} Politiquices.PT
        </div>
    </div>
  );
}
export default Footer;
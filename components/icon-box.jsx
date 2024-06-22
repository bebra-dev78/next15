import Box from "@mui/material/Box";

export default function IconBox({
  iconColor = "currentColor",
  iconMarginRight = 0,
  iconWidth = 24,
  iconUrl,
}) {
  return (
    <Box
      component="span"
      sx={{
        width: iconWidth,
        height: iconWidth,
        marginRight: iconMarginRight,
      }}
      style={{
        backgroundColor: iconColor,
        mask: `url(${iconUrl}) center center / contain no-repeat`,
      }}
    />
  );
}

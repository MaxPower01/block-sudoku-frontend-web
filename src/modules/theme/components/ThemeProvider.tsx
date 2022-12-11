import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import theme from "../theme";

export default function ThemeProvider(props: React.PropsWithChildren<{}>) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

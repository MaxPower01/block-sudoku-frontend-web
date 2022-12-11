import { Container } from "@mui/material";
import Level from "../modules/level/components/Level";
import { CSSBreakpoint } from "../utils/enums";

export default function Arcade() {
  return (
    <Container maxWidth={CSSBreakpoint.ExtraSmall}>
      <Level />
    </Container>
  );
}

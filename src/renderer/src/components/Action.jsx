import { Button, KIND } from "baseui/button";

export default function Action({ label, onClick }) {
  return (
    <Button kind={KIND.secondary} onClick={onClick}>
      {label}
    </Button>
  );
}

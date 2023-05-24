import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    color?: string;
    onClick: () => void;
}
export const Button = ({children, color = "primary", onClick}: Props) => {
  return (
    <button className={"btn btn-" + color} onClick={onClick}>{children}</button>
  )
}

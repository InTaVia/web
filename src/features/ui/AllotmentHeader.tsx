export interface AllotmentHeaderProps {
  title?: string;
}

export default function AllotmentHeader(props: AllotmentHeaderProps): JSX.Element {
  const { title } = props;
  return <div className="h-7 bg-intavia-green-100">{title}</div>;
}

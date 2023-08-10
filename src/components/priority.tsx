interface PriorityProps {
  priority: number;
  onChange: (priority: number) => void;
  name: string;
  disabled?: boolean;
  readonly?: boolean;
}
export default function Priority(props: PriorityProps) {
  return (
    <div className="rating">
      {Array.from({ length: 5 }).map((_, currentPriority) => (
        <input
          key={`${props.name}-${currentPriority}`}
          type="radio"
          className="mask bg-primary dark:bg-orange-400 mask-star"
          value={currentPriority + 1}
          defaultChecked={currentPriority + 1 === props.priority}
          name={props.name}
          onClick={() => props.onChange(currentPriority + 1)}
          disabled={props.disabled}
          readOnly={props.readonly}
        />
      ))}
    </div>
  )
}

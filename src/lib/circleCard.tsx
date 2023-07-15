interface CircleCardProps {
  circle: Circle;
  onUnselect?: () => void;
}
export default function CircleCard(props: CircleCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center flex flex-row">
        <div className="flex flex-col">
          <h2 className="card-title">{props.circle.name}</h2>
          <p>
            {props.circle.day}日目 {({
              west: "西",
              east: "東",
              south: "南",
            })[props.circle.wing]} {props.circle.place}
          </p>
        </div>
        <div className="card-actions justify-end ml-2">
          <button className="btn" onClick={props?.onUnselect}>選択解除</button>
        </div>
      </div>
    </div>
  )
}

export default async function AddCircle() {
  return (
    <div className="w-full max-w-2xl">
      <form className="form-control">
        <div>
          <label className="label" htmlFor="circleName">
            <span className="label-text">サークル名</span>
          </label>
          <input type="text" id="circleName" placeholder="上海アリス幻樂団" className="input input-bordered" required />
        </div>

        <label className="label">
          <span className="label-text">出店日</span>
        </label>
        <div className="join">
          <input className="join-item btn" type="radio" name="circleDay" aria-label="1日目" value="day1" required />
          <input className="join-item btn" type="radio" name="circleDay" aria-label="2日目" value="day2" required />
        </div>

        <label className="label">
          <span className="label-text">出店日</span>
        </label>
        <div className="join">
          <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="西" value="west" required />
          <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="東" value="east" required />
          <input className="join-item btn" type="radio" id="circleWing" name="circleWing" aria-label="南" value="south" required />
        </div>

        <label className="label" htmlFor="circlePlace">
          <span className="label-text">出店場所</span>
        </label>
        <input type="text" id="circlePlace" placeholder="ま42b" className="input input-bordered" required />

        <label className="label" htmlFor="circleImage">
          <span className="label-text">お品書き</span>
        </label>
        <input type="file" id="circleImage" className="file-input file-input-bordered w-full max-w-xs" />

        <label className="label" htmlFor="rating">
          <span className="label-text">優先度</span>
        </label>
        <div className="rating">
          <input type="radio" name="rating" className="mask mask-star" value="rate-1" />
          <input type="radio" name="rating" className="mask mask-star" value="rate-2" />
          <input type="radio" name="rating" className="mask mask-star" value="rate-3" defaultChecked />
          <input type="radio" name="rating" className="mask mask-star" value="rate-4" />
          <input type="radio" name="rating" className="mask mask-star" value="rate-5" />
        </div>

        <div>
          <input type="submit" value="送信" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}

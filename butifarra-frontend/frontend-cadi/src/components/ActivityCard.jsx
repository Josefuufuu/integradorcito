import PropTypes from "prop-types";
import Tag from "./ui/Tag";
import Button from "./ui/Button";

export default function ActivityCard({ title, tags=[], place, when, rating, quota, onEnroll }) {
  return (
    <article className="bg-white border rounded-xl p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="flex gap-2 mb-2">{tags.map((t,i)=><Tag key={i} color={i? "indigo":"green"}>{t}</Tag>)}</div>
      <ul className="text-sm text-gray-700 space-y-1 mb-3">
        <li>📍 {place}</li>
        <li>🗓️ {when}</li>
        <li>⭐ {rating} · 👥 {quota}</li>
      </ul>
      <Button variant="primary" onClick={onEnroll}>Inscribirse</Button>
    </article>
  );
}
ActivityCard.propTypes = {
  title: PropTypes.string.isRequired, tags: PropTypes.arrayOf(PropTypes.string),
  place: PropTypes.string, when: PropTypes.string, rating: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  quota: PropTypes.string, onEnroll: PropTypes.func
};

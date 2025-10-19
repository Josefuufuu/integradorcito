import PropTypes from "prop-types";
import Button from "./Button";

export default function StatCard({ title, value, cta, onClick, tone="indigo" }) {
  const rings = { indigo:"ring-indigo-100", orange:"ring-orange-100", green:"ring-green-100", purple:"ring-purple-100" };
  return (
    <article className={`rounded-xl border p-4 ring-4 ${rings[tone]} bg-white`}>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-3xl font-semibold my-1">{value}</div>
      {cta && <Button variant="ghost" onClick={onClick}>{cta}</Button>}
    </article>
  );
}
StatCard.propTypes = { title: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string,PropTypes.number]), cta: PropTypes.string, onClick: PropTypes.func, tone: PropTypes.oneOf(["indigo","orange","green","purple"]) };

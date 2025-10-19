import PropTypes from "prop-types";
import Button from "./Button";
export default function SectionHeader({ title, onViewAll }) {
  return (
    <div className="flex items-center justify-between my-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {onViewAll && <Button size="sm" onClick={onViewAll}>Ver todas</Button>}
    </div>
  );
}
SectionHeader.propTypes = { title: PropTypes.string.isRequired, onViewAll: PropTypes.func };

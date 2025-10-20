import PropTypes from "prop-types";
import Button from "./Button";

export default function SectionHeader({ title, subtitle, onViewAll }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {onViewAll && (
        <Button size="sm" variant="primary" onClick={onViewAll}>
          Ver todas
        </Button>
      )}
    </div>
  );
}
SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onViewAll: PropTypes.func,
};

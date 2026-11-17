import type { OrderWork } from './types';
import { mockMechanics } from './mockMechanics';

type AssignWorkExecutorProps = {
  orderId: number;
  work: OrderWork;
  onAssign: (mechanicId: number | null) => void;
  disabled?: boolean;
};

function AssignWorkExecutor({
  orderId,
  work,
  onAssign,
  disabled = false,
}: AssignWorkExecutorProps) {
  const inputId = `mechanic-${orderId}-${work.id}`;

  return (
    <div className="work-executor">
      <label htmlFor={inputId}>Исполнитель</label>

      <select
        id={inputId}
        className="appointment-select"
        value={work.mechanicId ?? ''}
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;

          onAssign(value === '' ? null : Number(value));
        }}
      >
        <option value="">Не назначен</option>

        {mockMechanics.map((mechanic) => (
          <option key={mechanic.id} value={mechanic.id}>
            {mechanic.name} — {mechanic.specialization}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AssignWorkExecutor;

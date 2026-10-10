"use client";

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

export function SegmentControl<T extends string>({ options, value, onChange, label }: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="segment-control" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={value === option.value} className={value === option.value ? "segment-option active" : "segment-option"} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

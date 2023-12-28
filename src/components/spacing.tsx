export const Spacing = ({ h = 3 }: { h?: number }) => {
  return (
    <div
      style={{
        height: h * 4,
      }}
    >
      &nbsp;
    </div>
  );
};

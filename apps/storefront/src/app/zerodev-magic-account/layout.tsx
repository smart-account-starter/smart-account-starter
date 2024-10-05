
async function MagicDemoLayout(props: React.PropsWithChildren) {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <div>{props.children}</div>
    </div>
  );
}

export default MagicDemoLayout;

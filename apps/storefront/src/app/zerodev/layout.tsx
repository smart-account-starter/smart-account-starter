
async function SiteLayout(props: React.PropsWithChildren) {
  return (
    <div className="flex min-h-[100vh] flex-col">
      {/* <SiteHeader user={user} /> */}
      <div>{props.children}</div>
      {/* <SiteFooter /> */}
    </div>
  );
}

export default SiteLayout;

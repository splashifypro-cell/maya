export default function WidgetLayout({ children }) {
  return (
    <div className="bg-transparent">
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background: transparent !important;
          background-color: transparent !important;
          overflow: hidden;
        }
      `}} />
      {children}
    </div>
  );
}

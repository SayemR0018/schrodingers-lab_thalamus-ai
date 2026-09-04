export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem("thalamus-theme");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;r.style.colorScheme=t;}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}

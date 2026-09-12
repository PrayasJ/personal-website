const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="system"){t="dark";localStorage.setItem("theme",t)}var d=t!=="light";document.documentElement.classList.toggle("dark",d)}catch(e){document.documentElement.classList.add("dark")}})();`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}

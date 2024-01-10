const e={currency:{option:"currency_option_"},shortcut:{link:"select_link_",name:"select_name_",img:"select_img_",reset:"reset_img_",default:"set_back_",remove:"remove_"}};let n={};async function t(){u(),o(),B(),w(),A(),W(),D(),U();let e=document.getElementsByTagName("input"),n=document.getElementsByTagName("button");[document.getElementsByTagName("select"),n,e].forEach((e=>{for(let n=0;n<e.length;n++){const t=e[n];"nav-button"!=t.id&&(t.disabled=!0)}}))}async function a(){n=JSON.parse(localStorage.getItem("save"))??{}}a().then(t);let r=!1;const i=document.getElementById("save-info");async function s(){r=!0,i.hidden=!1,localStorage.setItem("save",JSON.stringify(n)),r=!1,i.hidden=!0}function o(){var e=document.getElementById("bg_color");e.value=l(),e.onchange=()=>{n.bg_color=e.value.trim(),s()};var t=document.getElementById("select_bg");t.addEventListener("input",(()=>{const e=new FileReader;e.addEventListener("loadend",(e=>{null!=e.target&&(n.bg_img="".concat("url(",e.target.result,")"),s())}));const a=t.files.item(0);null!=a&&e.readAsDataURL(a)})),document.getElementById("delete_bg").onclick=()=>{n.bg_img=null,s()}}function l(){return n.bg_color??"black"}let c=[],d=[];async function u(){const e=document.getElementById("shortcut_shape_settings");e.addEventListener("change",(e=>{const t=e.target;if(!0===t.id.startsWith("shortcut_col_color")){const e=p();e[t.id.split("_")[3]]=t.value.trim(),n.shortcut_col_colors=e}else n[t.id]=t.value.trim();s()}));const t=p(),a=e.getElementsByTagName("select");for(const e of a)switch(!0){case e.id.startsWith("shortcut_col_color"):e.value=t[e.id.split("_")[3]];break;case e.id.startsWith("shortcut_transition"):e.value=y();break;case e.id.startsWith("shortcut_size"):e.value=b();break;case e.id.startsWith("shortcut_width"):e.value=f();break;case e.id.startsWith("shortcut_v_align"):e.value=k();break;case e.id.startsWith("shortcut_container_h_align"):e.value=v();break;case e.id.startsWith("shortcut_container_width"):e.value=_();break;default:e.value=n[e.id]??e.options[0].value}const r=document.getElementById("shortcut-settings-container"),i=document.createElement("datalist");i.id="suggestions",c=await h(),c.forEach((e=>{const n=document.createElement("option");n.value=e.link,i.appendChild(n)})),r.appendChild(i);let o=document.getElementById("shortcut-setting");for(let e=0;e<n.shortcuts.length;e++)r.appendChild(g(e,o));o.remove();document.getElementById("add_shortcut").addEventListener("click",(()=>{r.appendChild(g(n.shortcuts.push({link:"",name:"",img:""})-1,o)),s()}))}function m(e,t){n.shortcuts[t]=e,s()}function g(t,a){(a=a.cloneNode(!0)).classList.add(["bg-primary","bg-danger","bg-success","bg-warning"][t%4]),a.hidden=!1;let r=n.shortcuts[t]??{link:"",name:"",img:""};const i=a.getElementsByTagName("input");for(let n=0;n<i.length;n++){const t=i[n];t.id.startsWith(e.shortcut.link)?t.value=r.link:t.id.startsWith(e.shortcut.name)&&(t.value=r.name)}return a.addEventListener("input",(n=>{const a=n.target;switch(!0){case a.id.startsWith(e.shortcut.link):var i=a.value.trim();r.link=i,0==i.length&&(r.img="",r.name=""),m(r,t);break;case a.id.startsWith(e.shortcut.name):var s=a.value.trim();r.name=s.length>0?s:null,m(r,t);break;case a.id.startsWith(e.shortcut.img):const n=new FileReader;n.addEventListener("loadend",(e=>{null!=e.target&&(r.img=e.target.result,m(r,t))}));var o=a.files;if(null==o)return;var l=o.item(0);if(null==l)return;n.readAsDataURL(l)}})),a.addEventListener("click",(a=>{const i=a.target;switch(!0){case i.id.startsWith(e.shortcut.reset):for(let e=0;e<c.length;e++){const n=c[e];if(n.link==r.link)return r.img=n.img,void m(r,t)}if(""==r.img)return;r.img="",m(r,t);break;case i.id.startsWith(e.shortcut.remove):for(let e=0;e<d.length;e++)d[e]<t&&t--;n.shortcuts.splice(t,1),d.push(t),i.parentElement.parentElement.parentElement.remove(),s();break;case i.id.startsWith(e.shortcut.default):if(""==r.link)return;let a=document.createElement("canvas"),o=a.getContext("2d");a.width=256,a.height=256,o.fillStyle="#442288aa",o.fillRect(0,0,256,256),o.font="bold 160px monospace",o.textAlign="center",o.fillStyle="white",o.textBaseline="middle",o.fillText(r.link.replace("https://","").replace("http://","").replace("www.","").toUpperCase().slice(0,2),a.width/2,a.height/2),r.img=a.toDataURL(),m(r,t)}})),a}async function h(){return[{name:"",link:"https://github.com/",img:""},{name:"",link:"https://github.com/enfyna",img:""},{name:"",link:"https://github.com/enfyna/fx-new-tab",img:""},{name:"",link:"https://addons.mozilla.org/en-US/firefox/addon/fx-new-tab/",img:""},{name:"",link:"https://addons.mozilla.org/en-US/firefox/addon/fx-new-tab/",img:""},{name:"",link:"https://addons.mozilla.org/en-US/firefox/addon/fx-new-tab/",img:""},{name:"",link:"https://addons.mozilla.org/en-US/firefox/addon/fx-new-tab/",img:""}]}function f(){return n.shortcut_width??"col-sm-3"}function b(){return n.shortcut_size??"m-0"}function k(){return n.shortcut_v_align??"align-items-center"}function y(){return n.shortcut_transition??"glow"}function p(){return n.shortcut_col_colors??["bg-primary","bg-danger","bg-success","bg-warning"]}function v(){return n.shortcut_container_h_align??"justify-content-center"}function _(){return n.shortcut_container_width??"col-md-6"}function w(){const e=document.getElementById("enable_notes");e.checked=E(),e.addEventListener("change",(()=>{n.is_notes_enabled=e.checked,s()}))}function E(){return n.is_notes_enabled??!0}function B(){const e=document.getElementById("enable_clock");e.checked=S(),e.addEventListener("change",(()=>{n.is_clock_enabled=e.checked,s()}));const t=document.getElementById("clock_color");t.value=z(),t.addEventListener("change",(()=>{n.clock_color=t.value.trim(),s()}));const a=document.getElementById("clock_format");a.value=x(),a.addEventListener("change",(()=>{n.clock_format=a.value.trim(),s()}))}function S(){return n.is_clock_enabled??!0}function z(){return n.clock_color??"text-white"}function x(){return n.clock_format??"h:m"}function A(){const t=document.getElementById("national-currencies"),a=document.getElementById("crypto-currencies"),r=t.cloneNode(!0),i=a.cloneNode(!0);t.remove(),a.remove(),r.hidden=!1,i.hidden=!1,I();const o=document.getElementById("currency_setting").getElementsByTagName("select");for(let t=0;t<o.length;t++){const a=o[t];if("currency_container_color"!=a.id)if(a.appendChild(r.cloneNode(!0)),a.appendChild(i.cloneNode(!0)),a.id.startsWith(e.currency.option)){const t=a.id.replace(e.currency.option,"");a.value=n.currencies[t].name,a.addEventListener("change",(()=>{var e=n.currencies[t];e.name=a.value,e.rate="-",n.currencies[t]=e,s()}))}else a.value=N(),a.addEventListener("change",(()=>{n.base_currency=a.value;for(let e=0;e<3;e++)n.currencies[e].rate="-";s()}));else a.value=C(),a.addEventListener("change",(()=>{n.currency_container_color=a.value.trim(),s()}))}var l=document.getElementById("enable_api");l.checked=L(),l.addEventListener("change",(()=>{n.is_currency_rates_enabled=l.checked,s()}))}function L(){return n.is_currency_rates_enabled??!0}function I(){return null!=n.currencies||(n.currencies=[{name:"USD",rate:"-"},{name:"EUR",rate:"-"},{name:"GBP",rate:"-"}],s()),n.currencies}function N(){return n.base_currency??"TRY"}function C(){return n.currency_container_color??"bg-primary"}function W(){const e=document.getElementById("enable_firefox_watermark");e.checked=T(),e.addEventListener("change",(()=>{n.is_firefox_watermark_enabled=e.checked,s()}));const t=document.getElementById("firefox_color");t.value=R(),t.addEventListener("change",(()=>{n.firefox_watermark_color=t.value.trim(),s()}))}function R(){return n.firefox_watermark_color??"text-warning"}function T(){return n.is_firefox_watermark_enabled??!0}function D(){document.getElementById("nav-button").addEventListener("click",(()=>{r||(location.href="index.html")}))}function U(){const e=[{name:"settings",tr:"Ayarlar",en:"Settings",de:"Einstellungen",es:"Ajustes"},{name:"delete-link",tr:"Bir kısayolun linkini silerek ana menüden kaldırabilirsin.",en:"Delete shortcut link to remove it from the main menu.",de:"Entfernen Sie die URL, um sie aus dem Hauptmenü zu löschen.",es:"Elimina el URL para quitarlo del menú principal."},{name:"image-link",tr:"Kısayol ikonunu resim dosyası yükleyerek ayarlayabilirsin.",en:"Set a custom link icon by uploading an image file.",de:"Legen Sie ein benutzerdefiniertes Verknüpfungssymbol fest, indem Sie eine Bilddatei hochladen.",es:"Establece un ícono de enlace personalizado subiendo un archivo de imagen."},{name:"shortcut-settings",tr:"Kısayol Ayarları",en:"Shortcut Settings",de:"Verknüpfungseinstellungen",es:"Configuración de Accesos Directos"},{name:"shortcut-col-color",tr:"Sütun Rengi",en:"Column Color",de:"Spaltenfarbe",es:"Color de Columna"},{name:"shortcut-size",tr:"Boyut",en:"Size",de:"Größe",es:"Tamaño"},{name:"shortcut-container-settings",tr:"Kısayol Konteyner Ayarları",en:"Shortcut Container Settings",de:"Verknüpfungscontainer-Einstellungen",es:"Configuración del contenedor de accesos directos"},{name:"shortcut-v-align",tr:"Dikey Hizalanma",en:"Vertical Alignment",de:"Vertikale Ausrichtung",es:"Alineación vertical"},{name:"shortcut-h-align",tr:"Yatay Hizalanma",en:"Horizontal Alignment",de:"Horizontale Ausrichtung",es:"Alineación horizontal"},{name:"shortcut-width",tr:"Genişlik",en:"Width",de:"Breite",es:"Ancho"},{name:"shortcut-shape",tr:"Şekil",en:"Shape",de:"Form",es:"Forma"},{name:"square",tr:"Kare",en:"Square",de:"Quadrat",es:"Cuadrado"},{name:"blue",tr:"Mavi",en:"Blue",de:"Blau",es:"Azul"},{name:"red",tr:"Kırmızı",en:"Red",de:"Rot",es:"Rojo"},{name:"green",tr:"Yeşil",en:"Green",de:"Grün",es:"Verde"},{name:"yellow",tr:"Sarı",en:"Yellow",de:"Gelb",es:"Amarillo"},{name:"black",tr:"Siyah",en:"Black",de:"Schwarz",es:"Negro"},{name:"dark",tr:"Koyu",en:"Dark",de:"Dunkel",es:"Oscuro"},{name:"white",tr:"Beyaz",en:"White",de:"Weiß",es:"Blanco"},{name:"transparent",tr:"Saydam",en:"Transparent",de:"Durchsichtig",es:"Transparente"},{name:"circle",tr:"Daire",en:"Circle",de:"Kreis",es:"Círculo"},{name:"center",tr:"Orta",en:"Center",de:"Mitte",es:"Centro"},{name:"top",tr:"Üst",en:"Top",de:"Oben",es:"Arriba"},{name:"bottom",tr:"Alt",en:"Bottom",de:"Unten",es:"Abajo"},{name:"left",tr:"Sol",en:"Left",de:"Links",es:"Izquierda"},{name:"right",tr:"Sağ",en:"Right",de:"Rechts",es:"Derecha"},{name:"shortcut-transition",tr:"Geçiş Türü",en:"Transition Type",de:"Übergangstyp",es:"Tipo de Transición"},{name:"none",tr:"Hiçbiri",en:"None",de:"Keiner",es:"Ninguno"},{name:"move_down",tr:"Aşağı hareket et",en:"Move down",de:"Nach unten bewegen",es:"Mover hacia abajo"},{name:"move_up",tr:"Yukarı hareket et",en:"Move up",de:"Nach oben bewegen",es:"Mover hacia arriba"},{name:"scale_down",tr:"Küçült",en:"Scale down",de:"Verkleinern",es:"Reducir tamaño"},{name:"scale_up",tr:"Büyüt",en:"Scale up",de:"Vergrößern",es:"Aumentar tamaño"},{name:"spin",tr:"Döndür",en:"Spin",de:"Drehen",es:"Girar"},{name:"rotate",tr:"Çevir",en:"Rotate",de:"Rotieren",es:"Rotar"},{name:"glow",tr:"Parla",en:"Glow",de:"Leuchten",es:"Resplandor"},{name:"reset-default-icon-info",tr:"Yenile: Bu işlem mevcut kısayol simgesini silecek ve ana sayfayı açtığınızda simge API'sından bir simge almaya çalışacak.\nVarsayılan: Bu işlem, temel bir yedek simgeyi kısayol simgesi olarak ayarlar. Bu seçeneği, simge API pikselli bir simge döndürürse kullanabilirsiniz.",en:"Reset: This will delete the current shortcut icon and when you open the main page will try to fetch a icon from the icon API.\nDefault: This will set a basic fallback icon as the shortcut icon. You can use this if the icon API returns a pixelated icon.",de:"Zurücksetzen: Dies löscht das aktuelle Verknüpfungssymbol, und wenn Sie die Hauptseite öffnen, wird versucht, ein Symbol vom Symbol-API abzurufen.\nStandard: Hiermit wird ein einfaches Ersatzsymbol als Verknüpfungssymbol festgelegt. Sie können dies verwenden, wenn das Symbol-API ein pixeliges Symbol zurückgibt.",es:"Restablecer: Esto eliminará el icono de acceso directo actual y, al abrir la página principal, intentará obtener un icono de la API de iconos.\nPredeterminado: Esto establecerá un icono básico de respaldo como el icono de acceso directo. Puede utilizar esto si la API de iconos devuelve un icono pixelado."},{name:"rate-update-info",tr:"Döviz değerleri günlük yenilenir.",en:"Currency rates update daily.",de:"Währungskurse werden täglich aktualisiert.",es:"Los tipos de cambio de divisas se actualizan diariamente."},{name:"enable-api-label",tr:"Kur bilgilerini göster",en:"Enable currency rates",de:"Währungskurse aktivieren",es:"Habilitar tasas de cambio de divisas"},{name:"enable-clock-label",tr:"Saati etkinleştir",en:"Enable clock",de:"Uhr aktivieren",es:"Habilitar reloj"},{name:"enable-firefox-label",tr:"Firefox logosunu etkinleştir",en:"Enable firefox icon",de:"Firefox logo aktivieren",es:"Habilitar icono de Firefox"},{name:"color-label",tr:"Renk",en:"Color",de:"Farbe",es:"Color"},{name:"enable-notes-label",tr:"Notları etkinleştir",en:"Enable notes",de:"Notizen aktivieren",es:"Habilitar notas"},{name:"bg-settings",tr:"Arkaplan Ayarları",en:"Background Settings",de:"Hintergrund Einstellungen",es:"Configuración de fondo"},{name:"bg-fallback-color-label",tr:"Arkaplan Rengi",en:"Background Color",de:"Hintergrund Farbe",es:"Color de fondo"},{name:"bg-img-upload-info",tr:"Arka planı değiştirmek için bir resim dosyası yükleyebilirsiniz. \nNot: Yüklenen resim ne kadar büyükse o kadar yavaş açılır. Bu yüzden eğer resim çok yavaş yüklenirse, resmi sıkıştırmayı deneyebilirsiniz.",en:"You can upload a image file to change the background.\nNote : The larger the uploaded image, the slower it loads. Therefore, if the image loads very slowly, you can try compressing the image.",de:"Sie können eine Bilddatei hochladen, um den Hintergrund zu ändern. \nHinweis: Je größer das hochgeladene Bild ist, desto langsamer lädt es. Daher können Sie, wenn das Bild sehr langsam lädt, versuchen, das Bild zu komprimieren.",es:"Puedes subir un archivo de imagen para cambiar el fondo. \nNota: Cuanto más grande sea la imagen cargada, más lento se carga. Por lo tanto, si la imagen se carga muy lentamente, puedes intentar comprimir la imagen."},{name:"currency-api-refresh-warning",tr:"Eğer seçtiğiniz kur güncellenmezse bir kaç saniye beklemeyi deneyin.",en:"If currency types do not update, try waiting a few seconds.",de:"Wenn sich die Währungskurse nicht aktualisieren, versuchen Sie es nach einigen Sekunden erneut.",es:"Si las tasas de cambio de divisas no se actualizan, intente esperar unos segundos."},{name:"base-currency-label",tr:"Ana para birimini seç",en:"Select base currency",de:"Wählen Sie die Basiswährung",es:"Selecciona la moneda base"},{name:"currencies-label",tr:"Para birimleri",en:"Currencies",de:"Währungen",es:"Monedas"},{name:"link-label",tr:"Link",en:"URL",de:"URL",es:"URL"},{name:"name-label",tr:"İsim",en:"Name",de:"Name",es:"Nombre"},{name:"github-repo-info",tr:"Herhangi bir hata ile karşılaşırsanız veya yeni bir özellik isterseniz, buradan yeni bir issue açabilirsiniz: https://github.com/enfyna/fx-new-tab/issues",en:"If you encounter any issues or have a feature request, you can open a new issue at: https://github.com/enfyna/fx-new-tab/issues",de:"Wenn Sie auf einen Fehler gestoßen sind oder ein neues Feature wünschen, können Sie hier eine neue Issue öffnen: https://github.com/enfyna/fx-new-tab/issues",es:"Si has encontrado algún error o deseas una nueva función, puedes abrir un issue aquí: https://github.com/enfyna/fx-new-tab/issues"},{name:"national-currencies",tr:"Ulusal para birimleri",en:"National currencies",de:"Nationale Währungen",es:"Monedas nacionales"},{name:"crypto-currencies",tr:"Kripto para birimleri",en:"Cryptocurrencies",de:"Kryptowährungen",es:"Criptomonedas"},{name:"save-info",tr:"Lütfen bekleyiniz...",en:"Please Wait...",de:"Bitte Warten...",es:"Por favor, espere..."}];let n;switch(navigator.language.toLowerCase().split("-")[0]){case"tr":n="tr";break;case"de":n="de";break;case"es":n="es";break;default:n="en"}for(const t of e){const e=t.name,a=t[n];if("note-input"==e)for(const n of document.getElementsByName(e))n.placeholder=a;else if("base-currency-label"==e||"crypto-currencies"==e||"national-currencies"==e||"shortcut-shape"==e||"shortcut-size"==e||"shortcut-transition"==e||"shortcut-col-color"==e||"shortcut-width"==e||"shortcut-v-align"==e||"shortcut-h-align"==e||"color-label"==e)for(const n of document.getElementsByName(e))n.label=a;else if("delete-bg-button"==e||"set-default-button"==e)for(const n of document.getElementsByName(e))n.value=a;else for(const n of document.getElementsByName(e))n.innerText=a}}
const currency_api="https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/",img_api="https://icon.horse/icon/",node={currency:{name:"currency_name_",value:"currency_value_",option:"currency_option_"},shortcut:{link:"link_",name:"name_",img:"img_"},shortcut_setting:{link:"select_link_",name:"select_name_",img:"select_img_"},note:{note:"note_",input:"note_input_"}};function ready(){configure_shortcuts(),configure_notes(),configure_currencies(),translate()}function align_shortcuts(){var e=0,n=get_shortcut(null);for(let t=0;t<8;t++)""!=n[t].link&&(e+=1);document.getElementById("ShortcutContainer").classList.replace(e<=4?"align-items-start":"align-items-center",e<=4?"align-items-center":"align-items-start")}function configure_shortcuts(){align_shortcuts();for(let e=0;e<8;e++)set_shortcut_node(e),set_shortcut_setting(e)}let shortcuts,notes,currencies;function get_shortcut(e){if(null!=shortcuts)return null==e?shortcuts:shortcuts[e];let n=localStorage.getItem("shortcuts");return null!=n?shortcuts=JSON.parse(n):(shortcuts=[{name:"",img:"",link:"https://github.com"},{name:"",img:"",link:"https://youtube.com/"},{name:"",img:"",link:"https://chat.openai.com"},{name:"",img:"",link:"https://mail.google.com/mail/u/0/#inbox"},{name:"",img:"",link:"https://discord.com"},{name:"",img:"",link:"https://web.telegram.org/a/"},{name:"",img:"",link:"https://web.whatsapp.com/"},{name:"",img:"",link:"https://amazon.com"}],localStorage.setItem("shortcuts",JSON.stringify(shortcuts))),null==e?shortcuts:shortcuts[e]}function set_shortcut(e,n){let t=get_shortcut(null);t[n]=e,localStorage.setItem("shortcuts",JSON.stringify(t)),align_shortcuts(),set_shortcut_node(n)}function set_shortcut_node(e){var n=get_shortcut(e),t=document.getElementById(node.shortcut.link+e),r=t.parentElement;if(null==r)return;if(""==n.link)return void(r.hidden=!0);""==n.name&&(n.name=n.link.replace("https://","").replace("http://","").split("/")[0]),document.getElementById(node.shortcut.name+e).innerText=n.name,t.href=n.link,r.hidden=!1;var a=document.getElementById(node.shortcut.img+e);const i=n=>get_favicon_from_url(n).then((n=>{a.src=n;let t=get_shortcut(e);t.img=n,set_shortcut(t,e)}));a.onload=()=>{(a.naturalHeight<64||a.naturalWidth<64)&&i(n.link)},""!=n.img?a.src=n.img:i(n.link)}function get_favicon_from_url(e){return new Promise(((n,t)=>{if(0==navigator.onLine)return t("No internet connection. Cant get favicon.");e=e.replace("https://","").replace("http://","").replace("www.","").split("/")[0];let r=new Image;r.onload=()=>{let e=document.createElement("canvas"),t=e.getContext("2d");e.width=r.width,e.height=r.height,t.drawImage(r,0,0);var a=e.toDataURL();return n(a)},r.crossOrigin="anonymous",r.src=img_api+e}))}function set_shortcut_setting(e){var n=get_shortcut(e),t=document.getElementById(node.shortcut_setting.link+e),r=document.getElementById(node.shortcut_setting.name+e),a=document.getElementById(node.shortcut_setting.img+e);t.value=n.link,r.value=null==n.name||""==n.name?n.link.replace("https://","").replace("http://","").split("/")[0]:n.name,a.value="",t.addEventListener("change",(()=>{var i=t.value.trim();n.link=i,""==i&&(n.img="",n.name="",r.value="",a.value=""),set_shortcut(n,e)})),r.addEventListener("change",(()=>{var t=r.value.trim();n.name=t,set_shortcut(n,e)})),a.addEventListener("input",(()=>{const t=new FileReader;t.addEventListener("loadend",(t=>{null!=t.target&&(n.img=t.target.result,set_shortcut(n,e))}));var r=a.files;if(null!=r){var i=r.item(0);null!=i&&t.readAsDataURL(i)}}))}function get_notes(){if(null!=notes)return notes;const e=localStorage.getItem("notes");return null!=e&&""!=e?(notes=JSON.parse(e),notes):(notes=[{note:""},{note:""},{note:""},{note:""}],localStorage.setItem("notes",JSON.stringify(notes)),notes)}function configure_notes(){var e=get_notes();for(let r=0;r<4;r++){var n=document.getElementById(node.note.note+r);n.innerText=e[r].note;var t=document.getElementById(node.note.input+r);n.addEventListener("click",(()=>{var e=document.getElementById(node.note.note+r),n=document.getElementById(node.note.input+r);n.value=e.innerText,e.hidden=!0,n.hidden=!1,n.focus()})),t.addEventListener("change",(()=>{save_note(r)})),t.addEventListener("blur",(()=>{save_note(r)}))}}function save_note(e){var n=document.getElementById(node.note.note+e),t=document.getElementById(node.note.input+e);t.value=t.value.trim();var r=get_notes();r[e].note=t.value,localStorage.setItem("notes",JSON.stringify(r)),n.innerText=t.value,t.hidden=!0,n.hidden=!1}function configure_currencies(){if(did_a_day_pass())get_rates().then((()=>{for(let e=0;e<3;e++)reset_currency_rate(e),update_currency_node(e)})).catch((e=>{console.log(e)}));else for(let e=0;e<3;e++)update_currency_node(e);var e=document.getElementById("national-currencies"),n=document.getElementById("crypto-currencies");e=e.cloneNode(!0),n=n.cloneNode(!0),e.hidden=!1,n.hidden=!1;var t=[node.currency.option+0,node.currency.option+1,node.currency.option+2,"base_currency"];for(let a=0;a<t.length;a++){var r=document.getElementById(t[a]);r.appendChild(e.cloneNode(!0)),r.appendChild(n.cloneNode(!0)),a!=t.length-1?(r.value=get_currency(a).name,r.addEventListener("change",(()=>{var e=document.getElementById(node.currency.option+a),n=get_currency(a);n.name=e.value,n.rate="-",set_currency(n,a),update_currency_node(a)}))):(r.value=get_base_currency(),r.addEventListener("change",(()=>{localStorage.setItem("base_currency",r.value),currencies_json=null,get_rates().then((()=>{for(let e=0;e<3;e++)reset_currency_rate(e),update_currency_node(e)}),(e=>{console.log(e)}))})))}var a=document.getElementById("enable_api");a.checked=is_currency_rates_enabled(),hide_currency_elements(!a.checked),a.addEventListener("change",(()=>{hide_currency_elements(!a.checked),localStorage.setItem("is_currency_rates_enabled",a.checked.toString())})),document.getElementById("nav-button").addEventListener("click",(()=>{var e=document.getElementById("navbar");e.classList.replace("bg-transparent","bg-black")||e.classList.replace("bg-black","bg-transparent")}))}function reset_currency_rate(e){var n=get_currency(e);n.rate="-",set_currency(n,e)}function did_a_day_pass(){let e=localStorage.getItem("date"),n=Date.now();return(null==e||n-parseInt(e)>7e7)&&(localStorage.setItem("date",n.toString()),!0)}function is_currency_rates_enabled(){return"true"==localStorage.getItem("is_currency_rates_enabled")}function get_currency(e){if(null!=currencies)return null==e?currencies:currencies[e];var n=localStorage.getItem("currencies");return null!=n?currencies=JSON.parse(n):(currencies=[{name:"USD",rate:"-"},{name:"EUR",rate:"-"},{name:"GBP",rate:"-"}],localStorage.setItem("currencies",JSON.stringify(currencies))),null==e?currencies:currencies[e]}function set_currency(e,n){let t=get_currency(null);t[n]=e,localStorage.setItem("currencies",JSON.stringify(t))}function update_currency_node(e){var n=document.getElementById(node.currency.name+e),t=document.getElementById(node.currency.value+e),r=get_currency(e);n.innerText=r.name,t.innerText=r.rate,"-"==r.rate&&get_rates().then((n=>{r.rate=(1/n[r.name.toLowerCase()]).toFixed(2),t.innerText=r.rate,set_currency(r,e),update_currency_node(e)})).catch((e=>{console.log(e)}))}function get_base_currency(){let e=localStorage.getItem("base_currency");return null!=e&&0!=e.length||(e="TRY",localStorage.setItem("base_currency",e)),e}function hide_currency_elements(e=!0){const n=document.getElementById("currencies");for(const t of n.children)t.hidden=e}var currencies_json;function get_rates(){return new Promise(((e,n)=>{if(0==navigator.onLine)return n("No internet connection. Cant get currency rates.");if(null!=currencies_json)return e(currencies_json);const t=get_base_currency().toLowerCase(),r=new XMLHttpRequest;r.onreadystatechange=()=>{if(4==r.readyState)return 200==r.status?(currencies_json=JSON.parse(r.responseText)[t],e(currencies_json)):n("HTTP request failed")},r.open("GET",currency_api.concat(t,".min.json"),!0),r.send()}))}function translate(){const e=[{name:"settings",tr:"Ayarlar",en:"Settings",de:"Einstellungen",es:"Ajustes"},{name:"delete-link",tr:"Bir kısayolun linkini silerek ana menüden kaldırabilirsin.",en:"Delete shortcut link to remove it from the main menu.",de:"Entfernen Sie die URL, um sie aus dem Hauptmenü zu löschen.",es:"Elimina el URL para quitarlo del menú principal."},{name:"image-link",tr:"Kısayol ikonunu resim dosyası yükleyerek ayarlayabilirsin. (en az 64x64 boyutunda)",en:"Set a custom link icon by uploading an image file. (at least 64x64 resolution)",de:"Legen Sie ein benutzerdefiniertes Verknüpfungssymbol fest, indem Sie eine Bilddatei hochladen. (mindestens 64x64 Auflösung)",es:"Establece un ícono de enlace personalizado subiendo un archivo de imagen. (al menos 64x64 de resolución)"},{name:"delete-cookie-warning",tr:"Bu site için çerezleri silersen ayarların sıfırlanır.",en:"If you delete cookies for this site, all data will revert to the default values.",de:"Wenn Sie die Cookies für diese Website löschen, werden alle Daten auf die Standardwerte zurückgesetzt.",es:"Si eliminas las cookies de este sitio, todos los datos volverán a los valores predeterminados."},{name:"cookie-info",tr:"Bu site ayarları kaydetmek için çerez kullanır.",en:"This site uses cookies to save settings.",de:"Diese Website verwendet Cookies, um Einstellungen zu speichern.",es:"Este sitio utiliza cookies para guardar la configuración."},{name:"rate-update-info",tr:"Döviz değerleri günlük yenilenir.",en:"Currency rates update daily.",de:"Währungskurse werden täglich aktualisiert.",es:"Los tipos de cambio de divisas se actualizan diariamente."},{name:"enable-api-label",tr:"Kur bilgilerini göster",en:"Enable currency rates",de:"Währungskurse aktivieren",es:"Habilitar tasas de cambio de divisas"},{name:"currency-api-info",tr:"Döviz değerleri bu API kullanılarak alınmaktadır: https://github.com/fawazahmed0/currency-api",en:"Currency rates are provided by this API: https://github.com/fawazahmed0/currency-api",de:"Währungskurse werden von dieser API bereitgestellt: https://github.com/fawazahmed0/currency-api",es:"Las tasas de cambio de divisas son proporcionadas por esta API: https://github.com/fawazahmed0/currency-api"},{name:"currency-api-refresh-warning",tr:"Eğer seçtiğiniz kur güncellenmezse bir kaç saniye beklemeyi deneyin.",en:"If currency types do not update, try waiting a few seconds.",de:"Wenn sich die Währungskurse nicht aktualisieren, versuchen Sie es nach einigen Sekunden erneut.",es:"Si las tasas de cambio de divisas no se actualizan, intente esperar unos segundos."},{name:"api-key-info",tr:"Ana sayfanda 3 tane kurun değerini görmek istiyorsan kullanabilirsin.",en:"This is an optional feature that adds 3 currency rate info to your main page.",de:"Dies ist eine optionale Funktion, die 3 Währungskursinformationen auf Ihrer Hauptseite hinzufügt.",es:"Esta es una característica opcional que agrega información de 3 tasas de cambio de divisas a tu página principal."},{name:"base-currency-label",tr:"Ana para birimini seç",en:"Select base currency",de:"Wählen Sie die Basiswährung",es:"Selecciona la moneda base"},{name:"currencies-label",tr:"Para birimleri",en:"Currencies",de:"Währungen",es:"Monedas"},{name:"link-label",tr:"Link",en:"URL",de:"URL",es:"URL"},{name:"name-label",tr:"İsim",en:"Name",de:"Name",es:"Nombre"},{name:"note-input",tr:"Kısa bir not giriniz",en:"Please enter a brief note",de:"Geben Sie eine kurze Notiz ein",es:"Ingresa una nota breve"},{name:"github-repo-info",tr:"Herhangi bir hata ile karşılaşırsanız veya yeni bir özellik isterseniz, buradan yeni bir issue açabilirsiniz: https://github.com/enfyna/fx-new-tab/issues",en:"If you encounter any issues or have a feature request, you can open a new issue at: https://github.com/enfyna/fx-new-tab/issues",de:"Wenn Sie auf einen Fehler gestoßen sind oder ein neues Feature wünschen, können Sie hier eine neue Issue öffnen: https://github.com/enfyna/fx-new-tab/issues",es:"Si has encontrado algún error o deseas una nueva función, puedes abrir un issue aquí: https://github.com/enfyna/fx-new-tab/issues"},{name:"national-currencies",tr:"Ulusal para birimleri",en:"National currencies",de:"Nationale Währungen",es:"Monedas nacionales"},{name:"crypto-currencies",tr:"Kripto para birimleri",en:"Cryptocurrencies",de:"Kryptowährungen",es:"Criptomonedas"}];let n;switch(navigator.language.toLowerCase().split("-")[0]){case"tr":n="tr";break;case"de":n="de";break;case"es":n="es";break;default:n="en"}for(const t of e){const e=t.name,r=t[n];if("note-input"==e)for(const n of document.getElementsByName(e))n.placeholder=r;else if("base-currency-label"==e||"crypto-currencies"==e||"national-currencies"==e)for(const n of document.getElementsByName(e))n.label=r;else for(const n of document.getElementsByName(e))n.innerText=r}}window.addEventListener("DOMContentLoaded",ready);
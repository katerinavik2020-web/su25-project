//    'angarModal':  { vId: 'modangar', bId: null,               template: 'angar' } // для Ангара

const viewerConfig = {
    'yak40': { vId: 'modyak40', bId: 'viewToggleButton', mId: 'modelModal' },
    'su25':  { vId: 'modsu25',  bId: 'bagage-trigger',   mId: 'modelModal' },
    'su33':  { vId: 'modsu33',  bId: 'cabin-trigger',    mId: 'modelModal' }
};
let currentActivePlane = null;
let currentOpenModalId = null;
let isFireMode = false;
let rocketsLaunched = false;
const modelTemplates = {
    yak40: `<model-viewer
        src="model_yak40.glb"
        id="modyak40" 
        skybox-image="cloud_layers_1k.hdr"   
        environment-image="neutral"
        camera-orbit="180deg 75deg auto"    
        exposure="1.3"
        shadow-intensity="0.5"
        shadow-softness="1" 
        auto-rotate        
        autorotate-delay="10000"         
        camera-controls
        shadow-intensity="1"
        poster="poster_yak40.webp" 
        ar        
        ar-modes="webxr scene-viewer quick-look"         
        alt="3D модель с поддержкой AR">    
  <button slot="ar-button" style="background-color: white; border-radius: 8px; border: none; position: absolute; top: 16px; right: 16px; padding: 10px;">
    👋 Посмотреть в AR
  </button>
        <button slot="hotspot-salon" 
          class="cabin-hotspot" 
          data-position="0.14m 1.2m -1.25m" 
          data-normal="0.2 1 0" 
          data-visibility-attribute="visible"
          onclick="enterSalon()"> 
           <div class="annotation">Пассажиров:	до 32</div>        
        </button> 
        <button  class="cabin-hotspot" slot="hotspot-cabin" data-position="0.14m 0.7m -3.7m" 
         data-normal="0.3 0.8 -0.4" data-visibility-attribute="visible" onclick="enterCabin()">
         <div class="annotation">Экипаж:	3 человека</div>
         </button>
         <button class="hotspot_a" slot="hotspot-a1" data-position="-0.38m 1.20m 2.16m" data-normal="-0.47 0.88 0.00">
           <div class="annotation">3 двигателя АИ-25 <br> Максимальная скорость	550 км/ч</div>
         </button>
          <button class="hotspot_a" slot="hotspot-a2" data-position="3.34m 0.335m 1.33m" data-normal="-0.08m 1m 0m">
           <div class="annotation">Размах крыла:	25 м</div>
         </button>  
          <button class="hotspot_a" slot="hotspot-a3" data-position="-2.16m 2.85m 7.09m" data-normal="-0.22 0.97 0.13">
           <div class="annotation">Региональные пассажирские перевозки<br> Макс. взлётная масса: 16т <br>Дальность полёта	до 1800 км </div>
         </button>
         <button slot="hotspot-light-left" class="nav-light red" data-position="-7.16m 0.65m 1.5m" data-normal="0.14m 0.98m 0.15m"></button>  
         <button slot="hotspot-light-right" class="nav-light green" data-position="7.16m 0.65m 1.5m" data-normal="-0.03m 0.1m -0.01m"></button>
         <button slot="hotspot-light-tail" class="nav-light white" data-position="-0.022m 2.88m 7.52m" data-normal="0.05m 0.98m 0.20m"></button>
        <!-- Индикатор загрузки -->
        <div slot="progress-bar" class="custom-loader">
           <div class="loader-text">Загрузка модели...</div>
           <div class="update-bar"></div>
         </div>         
      </model-viewer>
    <div id="viewToggleButton" class="modal-btn" onclick="toggleView()" 
         style="position: absolute; bottom: 30px; right: 250px; z-index: 10; cursor: pointer; ">
      Заглянуть внутрь
    </div>  
    <div class="control-panel">      
      <label class="switch">       
        <input type="checkbox" id="night-checkbox">
        <span class="slider"></span>
      </label>
    </div>       
 <div class="modal-btn" 
     onclick="closeModelViewer()"
     style="position: absolute; bottom: 30px; left: 250px; z-index: 10; cursor: pointer;">
  Закрыть
  </div>`,
    
    su25: `<model-viewer
        src="model_su25.glb"
        id="modsu25" 
        skybox-image="nebo2.jpg"   
        environment-image="neutral"
        camera-orbit="490.4deg 73.01deg 22.14m"          
        exposure="1.3"
        shadow-intensity="0.5"
        shadow-softness="1" 
        autorotate-delay="10000"
        auto-rotate        
        min-camera-orbit="auto auto 0m" 
        min-field-of-view="10deg"
        camera-controls
        shadow-intensity="1"       
        ar        
        ar-modes="webxr scene-viewer quick-look"          
        alt="3D модель с поддержкой AR">  
        <!-- Кастомная кнопка AR (появится только на мобильных с поддержкой AR) -->
        <button slot="ar-button" style="background-color: white; border-radius: 8px; border: none; position: absolute; top: 16px; right: 16px; padding: 10px;">
          👋 Посмотреть в AR
        </button>
        <button slot="hotspot-bagage" 
          class="cabin-hotspot" 
          id="bagage-trigger"
          data-position="0.31m -0.20m -0.05m" data-normal="0 -1 0"
          data-visibility-attribute="visible"
          onclick="enterbagage()">         
        </button> 
        <button class="hotspot_a" slot="hotspot-a1" data-position="0.2m 0.67m -3.3m" data-normal="0.8m 0.4m -0.3m">
          <div class="annotation">Экипаж: 1 человек<br>Бронированная кабина («титановая ванна»)</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a2" data-position="0.59m 0.83m 0.51m" data-normal="-0.01 1.00 0.08">
          <div class="annotation">2 двигателя Р-95Ш<br>Макс. скорость: 950 км/ч</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a3" data-position="3.02m 0.37m 0.22m" data-normal="1.00 -0.00 -0.00">
          <div class="annotation">Вооружение: авиапушка ГШ-30-2<br>10 точек подвески вооружения<br>Боезапас: 250 снарядов</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a4" data-position="-1.73m 0.73m 0.55m" data-normal="-0.07 1.00 0.07">
          <div class="annotation">Размах крыла: 14.4 м</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a5" data-position="1.52m 1.03m 3.66m" data-normal="-0.06 1.00 0.01" >
          <div class="annotation">Штурмовик поддержки войск<br>Макс. взлётная масса: 17.6 т<br>Практический потолок: 7000 м</div>
        </button>        
        <div id="t1" slot="hotspot-t1" class="rocket-trail" data-position="1.50m 0.21m -1.20m" data-normal="0.90m 0.37m -0.23m"></div>
        <div id="t2" slot="hotspot-t2" class="rocket-trail" data-position="2.02m 0.19m -0.82m" data-normal="0.67m 0.67m -0.31m"></div>
        <div id="t3" slot="hotspot-t3" class="rocket-trail" data-position="2.55m 0.12m -0.72m" data-normal="0.92m 0.24m -0.31m"></div>
        <div id="t4" slot="hotspot-t4" class="rocket-trail" data-position="3.12m 0.10m -0.73m" data-normal="0.97m 0.25m -0.02m"></div>
        <div id="t5" slot="hotspot-t5" class="rocket-trail" data-position="-1.79m 0.08m -0.92m" data-normal="0.92m -0.24m -0.31m"></div>
        <div id="t6" slot="hotspot-t6" class="rocket-trail" data-position="-2.36m 0.12m -0.75m" data-normal="0.92m 0.23m -0.31m"></div>
        <div id="t7" slot="hotspot-t7" class="rocket-trail" data-position="-2.94m 0.10m -0.49m" data-normal="0.22m 0.52m -0.82m"></div>
        <!-- Индикатор загрузки -->
        <div slot="progress-bar" class="custom-loader">
           <div class="loader-text">Загрузка модели...</div>
           <div class="update-bar"></div>
         </div>
      </model-viewer>
      <div id="fire-control" onclick="handleFireClick(event)"></div>
 <div class='modal-btn' onclick="closeModelViewer()" style="position: absolute; bottom: 30px; left: 0; right: 0; margin: 0 auto; width: fit-content; z-index: 10; cursor: pointer;">Закрыть</div>`,
    
    su33: `<model-viewer
        id="modsu33" 
        src="model_su33.glb"
        skybox-image="nebo1.jpg"   
        environment-image="neutral"
        exposure="1.3"
        shadow-intensity="0.5"
        shadow-softness="1" 
        autorotate-delay="10000"
        auto-rotate        
        camera-controls
        shadow-intensity="1"
        touch-action="none"
        camera-orbit="52.32deg 52.35deg 44.54m" 
        field-of-view="30deg"
        poster="poster_su33.webp" 
        ar        
        ar-modes="webxr scene-viewer quick-look"         
        alt="3D модель с поддержкой AR">    
  <button slot="ar-button" style="background-color: white; border-radius: 8px; border: none; position: absolute; top: 16px; right: 16px; padding: 10px;">
    👋 Посмотреть в AR
  </button>
        <button slot="hotspot-su331" id="cabin-trigger" class="cabin-area" 
        data-position="7.2m 3.6m 0.2m" data-normal="0.1 0.6 0.8" 
        style="opacity: 0; pointer-events: none;"
        onclick="toggleView_su33()"> 
        <div class="annotation">Экипаж: 1 человек</div>
        </button>
<button id="eject-button" class="hotspot" slot="hotspot-eject" 
        data-position="7.31m 3.16m 0.18m" 
        onclick="event.stopPropagation(); startEjectVideo();" 
        style="display: none;">
</button>
        <button class="hotspot_a" slot="hotspot-a2" data-position="-5.99m 2.64m -0.93m" data-normal="-0.04 0.98 0.21">
          <div class="annotation">2 двигателя АЛ-31Ф-3<br>Макс. скорость: 2300 км/ч (M=2.17)</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a3" data-position="-5.98m 2.13m 0.37m" data-normal="-0.00 -1.00 0.04">
          <div class="annotation">Тормозной гак для посадки<br>на авианосец «Адмирал Кузнецов»<br>Система дозаправки в воздухе</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a4" data-position="-2.72m 2.65m 3.55m" data-normal="0.01 0.81 -0.59">
          <div class="annotation">Размах крыла: 14.7 м<br>Крылья складываются для хранения</div>
        </button>
        <button class="hotspot_a" slot="hotspot-a5" data-position="-6.48m 1.93m -3.79m" data-normal="0.07 1.00 -0.07">
          <div class="annotation">Многоцелевой палубный истребитель<br>Переднее горизонтальное оперение (ПГО)<br>Дальность: до 3000 км<br>
          Практический потолок: около 17 000 м</div>
        </button>  
        <!-- Индикатор загрузки -->
        <div slot="progress-bar" class="custom-loader">
           <div class="loader-text">Загрузка модели...</div>
           <div class="update-bar"></div>
         </div>        
</model-viewer>
<div id="video-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 9999; justify-content: center; align-items: center;">
    <!-- Кнопка пропуска -->
    <button id="skip-video" style="position: absolute; bottom: 30px; right: 30px; padding: 10px 20px; background: rgba(255, 120, 0, 0.2); color: white; border: 1px solid white; cursor: pointer; border-radius: 5px; z-index: 10000;">
        Пропустить →
    </button>    
    <video id="eject-video" style="max-width: 100%; max-height: 100%;">
        <source type="video/mp4">
    </video>
</div>
 <div class='modal-btn' onclick="closeModelViewer()" style="position: absolute; bottom: 30px; left: 0; right: 0; margin: 0 auto; width: fit-content; z-index: 10; cursor: pointer;">Закрыть</div>`
};

const activeAnnotationTimers = {};
const data={
  yak40:{
    title:'Як-40',
    text:'Як-40 — реактивный пассажирский самолёт для местных авиалиний, созданный в ОКБ Яковлева под руководством конструктора К.В. Синельщикова. Самолёт стал первым в мире серийным реактивным лайнером данного класса и был сертифицирован по международным нормам лётной годности.',
    history:'Первый полёт Як-40 состоялся 21 октября 1966 года (лётчики-испытатели А.Л. Колосов и Ю.В. Петров). Серийное производство велось на Саратовском авиационном заводе с 1968 по 1981 год. Всего было построено 1 011 самолётов, из которых 125 были экспортированы в 18 стран. Конструкция самолёта — трёхдвигательный высокоплан с Т-образным хвостовым оперением и тремя турбореактивными двигателями АИ-25 тягой по 1500 кгс — обеспечивала возможность взлёта с грунтовых ВПП длиной около 1200 метров. Як-40 отличался высокой надёжностью, простотой эксплуатации и активно использовался в гражданской авиации СССР.',
    exhibit:'Экспонат музея МАИ — серийный самолёт с бортовым номером СССР-87708. Использовался для практической подготовки студентов кафедры конструкции и проектирования самолётов. Самолёт сохранил оригинальную окраску «Аэрофлота».'
  },
  su25:{
    title:'Су-25',
    text:'Су-25 — дозвуковой бронированный штурмовик, предназначенный для непосредственной авиационной поддержки сухопутных войск на поле боя. Самолёт спроектирован для работы в условиях интенсивного огневого противодействия и способен действовать с неподготовленных аэродромов.',
    history:'Штурмовик Су-25 был разработан в ОКБ Сухого. Работы начались в 1968 году под руководством П.О. Сухого и О.С. Самойловича. Первый опытный самолёт Т-8-1 совершил первый полёт 22 февраля 1975 года, лётчик-испытатель — В.С. Ильюшин. Самолёт был принят на вооружение в 1981 году. Су-25 активно применялся в Афганской войне, где получил неофициальное прозвище «Грач». Серийное производство велось на Тбилисском авиационном заводе до 1991 года, всего было построено около 1320 самолётов.',
    exhibit:'Экспонат музея МАИ — Су-25 ранней серии с характерным «афганским» камуфляжем. На фюзеляже нанесены отметки о боевых вылетах в виде силуэтов танков, свидетельствующие о реальном боевом применении самолёта.'
  },
  su33:{
    title:'Су-33',
    text:'Су-33 (заводской шифр Т-10К; ранее известный как Су-27К; по кодификации НАТО: Flanker-D — «Фланкер-Д») — советский/российский палубный истребитель четвёртого поколения, разработанный для ВМФ России в ОКБ Сухого под руководством Михаила Симонова. Хотя текущие планы ВМФ РФ состоят в постройке новых палубных самолётов МиГ-29К из-за их большей компактности и возможности увеличения авиагруппы авианесущего крейсера «Адмирал флота Советского Союза Кузнецов», текущий парк Су-33, имеющих большую грузоподъёмность и дальность, планируется сохранять и модернизировать: для этого в 2016 году начато снова производство двигателей «АЛ-31Ф серии 3» для Су-33, а также начата модернизация самолёта установкой прицельной системы СВП-24.',
    history:'Начало разработки: середина 1980-х годов, советская морская авиация нуждалась в высокопроизводительном палубном истребителе на базе Су-27.Первый полёт прототипа: 17 августа 1987 г. (выполнен Су-27К, прототип Су-33).Вступление в строй: официально принят на вооружение в августе 1998 г.Производство и эксплуатация: после распада СССР планы были сокращены; всего построено примерно 24–35 самолётов (обычно называют около 24 серийных машин).Эксплуатация: использовался в составе морской авиации ВМФ России на «Адмирале Кузнецове».Экспорт: попытки продажи Китаю и Индии успеха не имели.Планируемое снятие с вооружения: с постепенным выводом Су-33 на смену встали более компактные палубные МиГ-29К',
    exhibit:'В Московском авиационном институте (МАИ) представлен самолёт Су-33 — палубный истребитель, разработанный ОКБ Сухого. Экспонат используется в учебно-демонстрационных целях и позволяет студентам и посетителям института наглядно ознакомиться с конструкцией и особенностями палубной авиации.'
  },
  mi2: {
    title: 'Ми-2',
    text: 'Ми-2 - легкий многоцелевой вертолёт, ставший первым советским серийным вертолётом с газотурбинными двигателями.',
    history: 'Разработан в ОКБ М. Л. Миля в начале 1960-х годов. Вертолёт уникален тем, что при советской разработке всё его серийное производство было сосредоточено в Польше. Широко применялся в сельском хозяйстве, санитарной авиации и обучении пилотов.',
    exhibit: 'Используется на учебном аэродроме МАИ для практических занятий студентов факультета №1.'
  },
  kvant: {
    title: 'Квант (МАИ-890)',
    text: 'Легкий многоцелевой самолет-биплан, разработанный в ОСКБЭС МАИ.',
    history: 'Проектирование началось в 1987 году. Самолет создавался как очень простая, надежная и маневренная машина. Он уникален тем, что при малых размерах обладает полноценным управлением и прочностью взрослого самолета. МАИ-890 прошел сертификацию и выпускался серийно.',
    exhibit: 'Натурный образец находится в ангаре кафедры 101 и на учебном аэродроме МАИ.'
  }
};

let globalResumeTimeout = null;
let reloadTimerF = null;
function openModal(k){	
  const specs={
  yak40:`<table class="spec-table">
    <tr><th>👨‍✈️ Экипаж</th><td>3 человека</td></tr>
    <tr><th>🧍‍♂️ Пассажиров</th><td>до 32</td></tr>
    <tr><th>🚀 Максимальная скорость</th><td>550 км/ч</td></tr>
    <tr><th>🛫 Дальность полёта</th><td>до 1800 км</td></tr>
    <tr><th>📏 Размах крыла</th><td>25,0 м</td></tr>
    <tr><th>⚖️ Макс. взлётная масса</th><td>≈ 16 000 кг</td></tr>
    <tr><th>🏙️ Назначение</th><td>Региональные пассажирские перевозки</td></tr>
  </table>`,
  su25:`<table class="spec-table">
    <tr><th>👨‍✈️ Экипаж</th><td>1 человек</td></tr>
    <tr><th>🚀 Максимальная скорость</th><td>950 км/ч</td></tr>
    <tr><th>💣 Боевая нагрузка</th><td>до 4400 кг</td></tr>
    <tr><th>🛡️ Бронирование</th><td>Титановая защита кабины</td></tr>
    <tr><th>📏 Размах крыла</th><td>14,4 м</td></tr>
    <tr><th>⚖️ Макс. взлётная масса</th><td>≈ 17 600 кг</td></tr>
    <tr><th>🎯 Назначение</th><td>Поддержка сухопутных войск</td></tr>
  </table>`,
  su33:`<table class="spec-table">
    <tr><th>👨‍✈️ Экипаж</th><td>1 человек</td></tr>
    <tr><th>🚀 Максимальная скорость</th><td>до ≈ 2 300 км/ч (≈ М=2,17 на большой высоте)</td></tr>
    <tr><th>☁️ Практический потолок</th><td>около 17 000 м</td></tr>
    <tr><th>🛫 Дальность полёта</th><td>до 3 000 км без дозаправки в воздухе
 (может увеличиваться при дозаправке)</td></tr>
    <tr><th>📐 Стреловидность крыла</th><td>42° по линии четверти хорд
 </td></tr>
    <tr><th>⚖️ Макс. взлётная масса</th><td>≈ 33 000 кг </td></tr>
    <tr><th>⚔️ Назначение</th><td>палубный истребитель завоевания превосходства в воздухе;прикрытие корабельных групп и авианосца;
перехват воздушных целей;ограниченное поражение надводных и наземных целей.</td></tr>
  </table>`,
  mi2: `<table class="spec-table">
    <tr><th>👨‍✈️ Экипаж</th><td>1 человек</td></tr>
    <tr><th>🧍‍♂️ Пассажиров</th><td>до 8</td></tr>
    <tr><th>🚀 Максимальная скорость</th><td>210 км/ч</td></tr>
    <tr><th>🛫 Дальность полёта</th><td>до 580 км</td></tr>
    <tr><th>📏 Диаметр несущего винта</th><td>14,5 м</td></tr>
    <tr><th>⚖️ Макс. взлётная масса</th><td>3 550 кг</td></tr>
    <tr><th>⚔️ Назначение</th><td>Многоцелевой (учебный, санитарный, с/х)</td></tr>
  </table>`,
  kvant: `<table class="spec-table">
    <tr><th>👨‍✈️ Экипаж</th><td>1 человек</td></tr>
    <tr><th>🚀 Максимальная скорость</th><td>160 км/ч</td></tr>
    <tr><th>🛫 Дальность полёта</th><td>до 400 км</td></tr>
    <tr><th>📏 Размах крыла</th><td>6,7 м</td></tr>
    <tr><th>⚖️ Макс. взлётная масса</th><td>540 кг</td></tr>
    <tr><th>⚔️ Особенность</th><td>Короткий разбег и посадка на неподготовленные площадки</td></tr>
  </table>`
};
const pStyle = `style="text-align: justify; text-indent: 25px; hyphens: auto; margin-bottom: 10px;"`;
  modalContent.innerHTML=`
    <h3>${data[k].title}</h3>
    <p ${pStyle}>${data[k].text}</p>
    <h4>Историческая справка</h4>
    <p ${pStyle}>${data[k].history}</p>
    <h4>Экспонат в музее МАИ</h4><p ${pStyle}>${data[k].exhibit || '—'}</p><h4>Основные характеристики</h4>
    ${specs[k]}
    <div class='modal-btn' onclick='closeModal()'>Закрыть</div>
  `;
  
  infoModal.style.display='flex';
  modalContent.scrollTop = 0; 
  document.body.style.overflow = 'hidden';
  history.pushState({ modalOpen: true, id: k }, "");
  speakDetailedInfo(k);
}
function closeModal(){infoModal.style.display='none';  document.body.style.overflow = ''; stopSpeak();}
const viewersu33 = document.querySelector('#modsu33');
const cabinBtn = document.querySelector('#cabin-trigger');
const ejectBtn = document.querySelector('#eject-button');
const overlay = document.querySelector('#video-overlay');
const video = document.querySelector('#eject-video');
const skipBtn = document.querySelector('#skip-video');

const states = {
    modsu33: { isInside: false, isTextured: false, orbit: '52.32deg 52.35deg 44.54m' },
    modyak40: { isInside: false, isTextured: false, orbit: '180deg 75deg auto' },
    modsu25: { isInside: false, isTextured: false, orbit: '490.4deg 73.01deg 22.14m' },
    modmi2:   { isInside: false, isTextured: false, orbit: '90deg 80deg 15m' },
    modkvant: { isInside: false, isTextured: false, orbit: '180deg 75deg 10m' }
};

// --- 2. ПОДГОТОВКА ВСЕХ МОДЕЛЕЙ (ПРОЗРАЧНОСТЬ И СЕРЫЙ ЦВЕТ) ---
function setupModelLoad(id) {
    const v = document.getElementById(id);
    if (!v) return;
    v.addEventListener('load', () => {
        const materials = v.model.materials;
        materials.forEach(material => {
            const texture = material.pbrMetallicRoughness.baseColorTexture;
            material.userData = { originalTexture: texture ? texture.texture : null };
            material.setAlphaMode('BLEND'); 
            material.pbrMetallicRoughness.baseColorTexture.setTexture(null); 
            material.pbrMetallicRoughness.setBaseColorFactor([0.9, 0.9, 0.9, 0.5]);
        });
    });
}
//['modsu33', 'modsu25', 'modyak40', 'modmi2', 'modkvant'].forEach(setupModelLoad);

// --- 3. ПЛАВНОЕ ПРОЯВЛЕНИЕ ТЕКСТУР (3 СЕК) ---
function smoothFadeIn(viewerId, btnId) {
    const viewer = document.getElementById(viewerId);
    if (!viewer) return;
    // КРИТИЧЕСКАЯ ПРАВКА: Ждем, пока модель загрузится, если её еще нет
    if (!viewer.model) {
        viewer.addEventListener('load', () => smoothFadeIn(viewerId, btnId), { once: true });
        return;
    }
    // Если текстуры уже есть, просто запускаем цикл
    if (states[viewerId].isTextured) {
        stopAllAnnotations();
        startAnnotationCycle(viewerId);
        return; 
    }    
    states[viewerId].isTextured = true;
    const materials = viewer.model.materials;
materials.forEach(m => {
        // Проверка: если данных нет (еще не сохранились), берем текущую текстуру
        const tex = (m.userData && m.userData.originalTexture) ? m.userData.originalTexture : null;
        if (tex && m.pbrMetallicRoughness.baseColorTexture) {
            m.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
        }
    });

    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        let progress = (timestamp - start) / 2500;
        if (progress > 1) progress = 1;
        const opacity = 0.5 + 0.5 * progress;
        const color = 0.9 + 0.1 * progress;
        materials.forEach(m => m.pbrMetallicRoughness.setBaseColorFactor([color, color, color, opacity]));
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            materials.forEach(m => {
                m.setAlphaMode('OPAQUE');
                m.pbrMetallicRoughness.setBaseColorFactor(); 
            });

            // Показываем кнопки управления
            const btn = document.getElementById(btnId);
            if(btn) btn.style.display = 'block';

            // Показываем скрытые хотспоты
            viewer.querySelectorAll('.cabin-hotspot, .cabin-area').forEach(h => {
                h.style.display = 'block';
                h.style.opacity = '1';
                h.style.pointerEvents = 'auto';
            });

            // ЗАПУСКАЕМ АВТО-АННОТАЦИИ ПОСЛЕ ПРОЯВЛЕНИЯ ТЕКСТУР
            startAnnotationCycle(viewerId);
        }
    }
    requestAnimationFrame(step);
}

// Привязка проявления к клику
// Объект для хранения таймеров (чтобы можно было отменить их при клике)
const autoFadeTimers = {};
//['modsu33', 'modsu25', 'modyak40'].forEach(id => {
//    const v = document.getElementById(id);
//    if (!v) return;
//    // --- ФУНКЦИЯ ПРОЯВЛЕНИЯ ---
//    const runFade = () => {
//        // Если таймер еще тикает — отменяем его (так как проявление уже пошло)
//        if (autoFadeTimers[id]) {
//            clearTimeout(autoFadeTimers[id]);
//            delete autoFadeTimers[id];
//        }        
//        const btnId = (id === 'modsu33') ? 'cabin-trigger' : (id === 'modsu25') ? 'bagage-trigger' : 'viewToggleButton';
//        smoothFadeIn(id, btnId);
//    };
//    // 1. АВТО-ПРОЯВЛЕНИЕ: запускаем таймер на 5 секунд после загрузки модели
//    v.addEventListener('load', () => {
//        autoFadeTimers[id] = setTimeout(runFade, 5000); // 5000 мс = 5 сек
//    });
//    // 2. РУЧНОЕ ПРОЯВЛЕНИЕ (твой текущий код)
//    v.addEventListener('click', (e) => {
//        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;        
//        // Если пользователь кликнул сам — отменяем авто-таймер
//        runFade(); 
//    });
//});



// --- 4. УНИВЕРСАЛЬНЫЙ КИНОПРОЛЕТ ---
function cinematicFly(viewer, targetPos, targetOrbit, exposure, onComplete) {
    viewer.autoRotate = false;
    viewer.removeAttribute('auto-rotate');
    viewer.minCameraOrbit = "auto auto 0m";
    viewer.maxCameraOrbit = "auto auto auto";
    viewer.setAttribute('near-path', '0.01');
    viewer.interpolationDecay = 15; // Плавное начало

    const cur = viewer.getCameraOrbit();
    viewer.cameraTarget = targetPos;
    viewer.cameraOrbit = `${cur.theta}rad ${cur.phi}rad ${cur.radius}m`;

    setTimeout(() => {
        viewer.interpolationDecay = 100;
        viewer.cameraOrbit = targetOrbit;
        viewer.fieldOfView = '130deg';
        viewer.exposure = exposure;
        setTimeout(() => {
            viewer.maxCameraOrbit = "auto auto 0.2m";
            viewer.minCameraOrbit = "auto auto 0.01m";
            if(onComplete) onComplete();
        }, 1200);
    }, 500);
}

// --- 5. ФУНКЦИИ ВХОДА (СУ-33, ЯК-40, СУ-25) ---
function toggleView_su33() {
    // Ищем элементы ПРЯМО ВНУТРИ функции, чтобы всегда находить новые из шаблона
    const v = document.getElementById('modsu33');
    const b = document.getElementById('cabin-trigger');
    const e = document.getElementById('eject-button');

    if (!v || !b) return; // Защита от вылета

    if (!states.modsu33.isInside) {
        states.modsu33.isInside = true;
        // Передаем найденный 'v' вместо старой переменной
        cinematicFly(v, '6.9m 3.3m 0.1m', '300deg 60deg 0.05m', 3.0, () => {
            b.classList.add('is-inside');
            b.innerHTML = "Внешний вид";
            if(e) e.style.display = "block";
        });
    } else { 
        exitModel('modsu33', 'cabin-trigger', 'eject-button'); 
    }
}

function enterSalon() {
    const v = document.getElementById('modyak40');
    const b = document.getElementById('viewToggleButton');
    stopAllAnnotations(); // Останавливаем авто-цикл, так как мы "внутри"
    states.modyak40.isInside = true;
    cinematicFly(v, '-0.1m 0.90m -1.45m', '180deg 90deg 0.1m', 2.0, () => {
        b.innerHTML = "Выйти из самолета"; b.style.background = "#ff4757";
    });
}

function enterCabin() {
    const v = document.getElementById('modyak40');
    const b = document.getElementById('viewToggleButton');
    stopAllAnnotations(); // Останавливаем авто-цикл, так как мы "внутри"
    states.modyak40.isInside = true;
    cinematicFly(v, '-0.3m 0.8m -3.0m', '10deg 80deg 0.2m', 2.5, () => {
        b.innerHTML = "Выйти из самолета"; b.style.background = "#ff4757";
    });
}

function enterbagage() {
    const v = document.getElementById('modsu25');
    const b = document.getElementById('bagage-trigger');
    stopAllAnnotations(); // Останавливаем авто-цикл, так как мы "внутри"
    if (!states.modsu25.isInside) {
        states.modsu25.isInside = true;
        cinematicFly(v, '-0m 0.5m -0.05m', '10deg 80deg 0.2m', 3.0, () => {
            b.classList.add('is-inside'); b.innerHTML = "Внешний вид";
        });
    } else { exitModel('modsu25', 'bagage-trigger'); }
}

// --- 6. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function exitModel(vId, bId, eId = null) {
    const v = document.getElementById(vId);
    const b = document.getElementById(bId);
    // ПРОВЕРКА: Если вьюер не найден, выходим сразу, чтобы не упасть на v.classList или v.model
    if (!v) return; 
    const ejectBtn = document.getElementById('eject-button');
    states[vId].isInside = false;    
    if (ejectBtn) { 
        ejectBtn.style.display = "none"; 
    }
    if(b) { b.classList.remove('is-inside'); b.innerHTML = (vId === 'modyak40') ? "Заглянуть внутрь" : ""; b.style.background = ""; }
    if(eId) { const e = document.getElementById(eId); if(e) e.style.display = "none"; }
        // Когда окно закрывается, принудительно возвращаем шасси  
    setGearVisibility(true); 
    // Сбрасываем статус ночи, если он был включен
    const nightSwitch = document.querySelector('#night-checkbox');
    if (nightSwitch) nightSwitch.checked = false; // Выключаем тумблер визуально    
    v.classList.remove('night-mode'); // Гасим габариты в CSS    
    // Гасим свет в окнах
 //if (!v.model || !v.model.materials) return; 
    const winMat = v.model.materials.find(m => m.name === 'Material.001');
    if (winMat) winMat.setEmissiveFactor();
    const rocketMat = v.model.materials.find(m => m.name === 'Spo15Rhaw1Mtl.001');
    if (rocketMat) {
        // Возвращаем видимость и выключаем свечение
        rocketMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
        rocketMat.setAlphaMode('OPAQUE');
        rocketMat.setEmissiveFactor([0, 0, 0]);
    }
    resetRocketsState(vId);
    v.resetTurntableRotation();
    v.minCameraOrbit = 'auto auto 0m';
    v.maxCameraOrbit = 'auto auto auto';
    v.cameraTarget = 'auto auto auto';
    v.cameraOrbit = states[vId].orbit;
    v.fieldOfView = '30deg';
    v.exposure = 1.3;  
    v.setAttribute('auto-rotate', '');
    v.autoRotate = true;
    v.disablePan = false; 
    startAnnotationCycle(vId);
    v.jumpCameraToGoal();
    v.updateFraming();         
}

function openModelViewer(planeKey) {
    currentOpenModalId = 'modelModal'; 
    currentActivePlane = planeKey;
    const modal = document.getElementById('modelModal'); 
    const container = document.getElementById('modelModalContent');
    const config = viewerConfig[planeKey]; 
    if (!modal || !container || !config) return;

    // --- НОВОЕ: Сбрасываем статус текстур для этой модели перед открытием ---
    if (states[config.vId]) {
        states[config.vId].isTextured = false;
    }

    // 1. Вставляем шаблон
    container.innerHTML = modelTemplates[planeKey];
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const v = document.getElementById(config.vId);
    if (v) {
        // 2. СРАЗУ ПОСЛЕ ЗАГРУЗКИ МОДЕЛИ ДЕЛАЕМ ЕЁ СЕРОЙ
        v.addEventListener('load', () => {
            const loader = v.querySelector('.custom-loader');
            if (loader) loader.style.setProperty('display', 'none', 'important');

            const materials = v.model.materials;
            materials.forEach(material => {
                const texture = material.pbrMetallicRoughness.baseColorTexture;
                material.userData = { originalTexture: texture ? texture.texture : null };
                material.setAlphaMode('BLEND'); 
                material.pbrMetallicRoughness.baseColorTexture.setTexture(null); 
                material.pbrMetallicRoughness.setBaseColorFactor([0.9, 0.9, 0.9, 0.5]);
            });

            // 3. АВТО-ПРОЯВЛЕНИЕ ЧЕРЕЗ 5 СЕКУНД
            autoFadeTimers[config.vId] = setTimeout(() => {
                smoothFadeIn(config.vId, config.bId);
            }, 5000);
        }, { once: true });

        // 4. РУЧНОЕ ПРОЯВЛЕНИЕ ПО КЛИКУ
        v.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            if (autoFadeTimers[config.vId]) clearTimeout(autoFadeTimers[config.vId]);
            smoothFadeIn(config.vId, config.bId);
        });
    }

    // --- ОЖИВЛЯЕМ ДЕНЬ-НОЧЬ ЯКА ---
    if (planeKey === 'yak40') {
        const ns = document.getElementById('night-checkbox');
        if (ns) {
            ns.addEventListener('change', (e) => {
                if (typeof toggleNightMode === 'function') {
                    toggleNightMode(e.target.checked);
                }
            });
        }
    }

    // Запуск аннотаций, если модель уже была проявлена (эту часть можно оставить или убрать, если хочешь ВСЕГДА проявление)
    if (states[config.vId] && states[config.vId].isTextured) {
        stopAllAnnotations();
        startAnnotationCycle(config.vId);
    }

    history.pushState({ modalOpen: true, id: 'modelModal' }, "");
}
function closeModelViewer() {
    const mId = currentOpenModalId; 
    if (!mId) return;

    const config = viewerConfig[mId];
    const modal = document.getElementById(mId);

    // 1. Сначала выполняем сброс (exitModel), пока кнопки еще есть в HTML!
    if (config) {
        exitModel(config.vId, config.bId);
    }

    // 2. И только ПОТОМ очищаем всё и закрываем
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    Object.values(activeAnnotationTimers).forEach(t => clearInterval(t));
    stopAllAnnotations();

    // Очистка в самом конце
    const container = document.getElementById('modelModalContent');
    if (container) container.innerHTML = '';
    
    currentOpenModalId = null;
}

function toggleView() {
    const v = document.getElementById('modyak40');
    if (!v) return;
    if (states.modyak40.isInside) exitModel('modyak40', 'viewToggleButton');
    else enterSalon();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Поиск ссылки "История и факты" по точному тексту
    const allLinks = document.querySelectorAll('a');
    const historyLink = Array.from(allLinks).find(link => 
        link.textContent.trim() === 'История и факты'
    );

    if (historyLink) {
        historyLink.addEventListener('click', () => {
            // Ищем все кнопки "Подробнее" в карточках
            const detailButtons = document.querySelectorAll('.modal-btn');
            
            detailButtons.forEach(btn => {
                // Перезапуск анимации
                btn.classList.remove('blink-active');
                void btn.offsetWidth; // Магия JS для сброса анимации (reflow)
                btn.classList.add('blink-active');

                // Удаление класса после завершения (3 секунды)
                setTimeout(() => {
                    btn.classList.remove('blink-active');
                }, 3000);
            });
        });
    }

    // 2. Вспомогательный код: если нужно, чтобы аннотации 
    // закрывались на мобилках при клике в другое место
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.hotspot_a')) {
            document.querySelectorAll('.annotation').forEach(a => a.style.opacity = '0');
        }
    }, {passive: true});
});
window.onpopstate = function(event) {
    // Находим все открытые модалки и закрываем их
    const openModals = document.querySelectorAll('.modal, [id^="modelModal"]');
    openModals.forEach(modal => {
        modal.style.display = 'none';
    });
};

document.querySelectorAll('model-viewer').forEach(viewer => {
    viewer.addEventListener('progress', (event) => {
        const progressBar = viewer.querySelector('.update-bar');
        if (progressBar) {
            // Устанавливаем переменную CSS --progress от 0 до 100
            const progress = event.detail.totalProgress * 100;
            progressBar.style.setProperty('--progress', `${progress}%`);
        }
    });

    viewer.addEventListener('load', () => {
        const loader = viewer.querySelector('.custom-loader');
        if (loader) {
            loader.classList.add('hidden'); // Плавно скрываем после загрузки
        }
    });
});
  

// Объект для хранения таймеров аннотаций (чтобы можно было остановить)


// --- 2. ЛОГИКА АВТО-АННОТАЦИЙ ---
function startAnnotationCycle(viewerId) {
    const viewer = document.getElementById(viewerId);
    const infoPanel = document.querySelector('#info-panel');
    const infoContent = infoPanel ? infoPanel.querySelector('.info-panel-content') : null;
        
    if (!viewer || !infoPanel) return;

    if (activeAnnotationTimers[viewerId]) clearInterval(activeAnnotationTimers[viewerId]);

    let currentIndex = 0;
    let isUserInteracting = false;
   // let resumeTimeout = null;

    const showNext = () => {
        if (viewer.offsetParent === null) { 
            stopAllAnnotations();
            return;
        }          
        // --- ГЛАВНАЯ ПРАВКА ДЛЯ ГИТХАБА ---
        if (states[viewerId].isInside) {
            viewer.autoRotate = false; // Принудительно выключаем вращение внутри
            infoPanel.classList.remove('visible'); 
            return;
        }
        // Если юзер трогает модель или она не должна крутиться — пропускаем аннотации
        if (isUserInteracting || !viewer.autoRotate) {
            infoPanel.classList.remove('visible'); 
            return;
        }
        const hotspots = viewer.querySelectorAll('.hotspot_a, .cabin-hotspot, .cabin-area');        
        if (hotspots.length === 0) return;

        document.querySelectorAll('.active').forEach(h => h.classList.remove('active'));

        const current = hotspots[currentIndex];
        const annotation = current.querySelector('.annotation');

        if (annotation && infoContent) {
            current.classList.add('active');
            infoPanel.classList.add('visible');
            const textToRead = annotation.innerText; 
            infoContent.innerHTML = annotation.innerHTML;
            viewer.classList.add('autocycle-active');
            speakAnnotation(textToRead);
        }
        currentIndex = (currentIndex + 1) % hotspots.length;
    };

    activeAnnotationTimers[viewerId] = setInterval(showNext, 8000);

   viewer.addEventListener('pointerdown', () => {
        if (isFireMode) return; 
        isUserInteracting = true;
        
        // 1. ПРИНУДИТЕЛЬНО ВЫКЛЮЧАЕМ авторотацию самой модели
        viewer.autoRotate = false; 
        
        // 2. Прячем все панели и активные точки
        infoPanel.classList.remove('visible');
        viewer.classList.remove('autocycle-active');
        document.querySelectorAll('.active').forEach(h => h.classList.remove('active'));

        clearTimeout(globalResumeTimeout);
        
        // 3. Ждем ровно 10 секунд тишины
        globalResumeTimeout = setTimeout(() => {
            if (isFireMode) return; 
            isUserInteracting = false;
            
            // 4. ПРИНУДИТЕЛЬНО ВКЛЮЧАЕМ авторотацию обратно
            viewer.autoRotate = true; 
            
            // Можно даже чуть "подтолкнуть" модель, чтобы она сразу начала вращаться
            viewer.play(); 
        }, 10000); 
    });
}
function stopAllAnnotations() {
    // 1. Останавливаем все запущенные интервалы
    Object.keys(activeAnnotationTimers).forEach(id => {
        clearInterval(activeAnnotationTimers[id]);
        delete activeAnnotationTimers[id];
    });

    // 2. Прячем саму панель
    const infoPanel = document.querySelector('#info-panel');
    if (infoPanel) {
        infoPanel.classList.remove('visible');
    }

    // 3. Убираем подсветку со всех хотспотов
    document.querySelectorAll('.active').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('model-viewer').forEach(v => v.classList.remove('autocycle-active'));
}
//// День-Ночь
//const nightSwitch = document.querySelector('#night-checkbox');
//if (nightSwitch) {
//nightSwitch.addEventListener('change', (event) => {
//  const viewer = document.getElementById('modyak40');
//  
//  // 1. ПРОВЕРКА: Если мы внутри (isInside === true), отменяем переключение
//  if (states['modyak40'] && states['modyak40'].isInside) {
//    event.target.checked = false; // Возвращаем тумблер обратно в "выкл"    
//    return;
//  }
//
//  const isNight = event.target.checked;
//  setGearVisibility(!isNight); 
//  const windowMaterial = viewer.model.materials.find(m => m.name === 'Material.001');
//  
//  if (isNight) {
//    viewer.classList.add('night-mode');
//    viewer.exposure = 0.2;
//    if (windowMaterial) {
//      windowMaterial.setEmissiveFactor([2.5, 2.0, 1.0]);
//    }
//  } else {
//    viewer.classList.remove('night-mode');
//    viewer.exposure = 1.3; // Возвращаем вашу стандартную яркость
//    if (windowMaterial) {
//      windowMaterial.setEmissiveFactor();
//    }
//  }
//})};
function toggleNightMode(isNight) {
    const viewer = document.getElementById('modyak40');
    if (!viewer || !viewer.model) return;

    setGearVisibility(!isNight); 
    const windowMaterial = viewer.model.materials.find(m => m.name === 'Material.001');
    
    if (isNight) {
        viewer.classList.add('night-mode');
        viewer.exposure = 0.2;
        if (windowMaterial) windowMaterial.setEmissiveFactor([2.5, 2.0, 1.0]);
    } else {
        viewer.classList.remove('night-mode');
        viewer.exposure = 1.3;
        if (windowMaterial) windowMaterial.setEmissiveFactor();
    }
}
/**
 * Управляет видимостью шасси (Material.020)
 * @param {boolean} show - true (показать/день), false (скрыть/ночь)
 */
function setGearVisibility(show) {
  const viewer = document.getElementById('modyak40');
  if (!viewer || !viewer.model) return;

  const gearMaterial = viewer.model.materials.find(m => m.name === 'Material.020');
  
  if (gearMaterial) {
    const color = gearMaterial.pbrMetallicRoughness.baseColorFactor;
    
    if (show) {
      // ВОЗВРАЩАЕМ ШАССИ
      gearMaterial.pbrMetallicRoughness.setBaseColorFactor([color[0], color[1], color[2], 1]);
      gearMaterial.setAlphaMode('OPAQUE');
      gearMaterial.pbrMetallicRoughness.setMetallicFactor(1); 
    } else {
      // СКРЫВАЕМ 
      gearMaterial.pbrMetallicRoughness.setBaseColorFactor([color[0], color[1], color[2], 0]);
      gearMaterial.setAlphaMode('BLEND');
      gearMaterial.pbrMetallicRoughness.setMetallicFactor(0); // убираем блики
    }
  }
}

// Подгружаем звук modsu25

const launchSound = new Audio('sound_launch.mp3'); 
 
function updateButtonUI(text, isReload) {
  const btn = document.getElementById('fire-control');
  if (btn) {
    btn.innerText = text;
    if (isReload) btn.classList.add('reloading');
    else btn.classList.remove('reloading');
  }
}
function resetRocketsState(vId) {
    const v = document.getElementById(vId);
    const mat = v.model ? v.model.materials.find(m => m.name === 'Spo15Rhaw1Mtl.001') : null;
    
    if (mat) {
        mat.setAlphaMode('OPAQUE');
        mat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
        mat.setEmissiveFactor([0, 0, 0]);
    }

    const ids = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];
    ids.forEach(id => {
        const t = document.getElementById(id);
        if (t) {
            t.style.transition = "none"; 
            t.classList.remove('launch');
            t.style.opacity = "0";
        }
    });

    rocketsLaunched = false;
    updateButtonUI("+", false);
    // Удаляем класс reloading с кнопки, если он там был
    const btn = document.getElementById('fire-control');
    if (btn) btn.classList.remove('reloading');
}

function playSynthLaunch() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Тип "sawtooth" (пила) дает более "технический" звук двигателя
        osc.type = 'sawtooth'; 
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        // Резкое падение частоты имитирует удаляющийся объект (эффект Доплера)
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
        console.log("Синтезатор звука не поддерживается");
    }
}

function handleFireClick(event) {
  if (event) event.stopPropagation();
  const viewer = document.getElementById('modsu25');
  if (!viewer) return; 
  const mat = viewer.model ? viewer.model.materials.find(m => m.name === 'Spo15Rhaw1Mtl.001') : null;
  const trails = ['t1','t2','t3','t4','t5','t6','t7','t8'].map(id => document.getElementById(id));
if (states.modsu25.isInside) {
      console.log("Блокировка: нельзя стрелять изнутри!");
      return; 
  }
  if (!rocketsLaunched) {
    // --- ПУСК ---
    isFireMode = true;
    // Сбрасываем старый таймер на всякий случай
    clearTimeout(reloadTimerF);
    stopAllAnnotations();

    // 1. УДАЛЯЕМ АТРИБУТЫ (Очищаем "память" HTML)
    viewer.removeAttribute('camera-orbit'); 
    viewer.removeAttribute('auto-rotate');
    viewer.autoRotate = false;
     viewer.resetTurntableRotation();
     viewer.jumpCameraToGoal();

    // 2. ФОРСИРОВАННЫЙ ПРЫЖОК (Через микро-паузу)
    // Это единственный способ заставить модель проигнорировать угол остановки
    setTimeout(() => {
      viewer.cameraOrbit = "130.5deg 73.44deg 22.14m";
      viewer.cameraTarget = "0m 0.5m 0m";
      viewer.fieldOfView = "30deg";
      viewer.jumpCameraToGoal(); // Мгновенное перемещение

      console.log("Камера принудительно зафиксирована");

      // 3. ЭФФЕКТЫ РАКЕТ
      setTimeout(() => {
viewer.exposure = 3.0; // Вспышка
setTimeout(() => {
    viewer.exposure = 1.3; // Возврат к норме
}, 200);
      if (launchSound && launchSound.readyState >= 2) { // 2 означает, что данные загружены
          launchSound.currentTime = 0;
          launchSound.play().catch(() => playSynthLaunch()); // Если play не сработал — поет синтезатор
      } else {
          playSynthLaunch(); // Файла нет или он не готов — поет синтезатор
      }
        if (mat) {
          mat.setAlphaMode('OPAQUE');
          mat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
          mat.setEmissiveFactor([6.0, 1.2, 0.0]);
        }
        trails.forEach((t, i) => {
          if (t) {
            t.style.opacity = "1";
            setTimeout(() => t.classList.add('launch'), i * 50);
          }
        });
        setTimeout(() => {
          if (mat) {
            mat.setAlphaMode('BLEND');
            mat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 0]);
          }
          rocketsLaunched = true;
          updateButtonUI("ЗАРЯД", true);
        }, 200);
      }, 400);
    }, 50); // Пауза 50мс нужна, чтобы модель успела обработать удаление атрибутов
reloadTimerF = setTimeout(() => {
      if (rocketsLaunched) { 
        console.log("Автоматическая перезарядка...");
        handleFireClick(); // Рекурсивно вызываем эту же функцию
      }
    }, 8000); // 8000 мс = 8 секунд

  } else {
    // --- ПЕРЕЗАРЯДКА (ручная или автоматическая) ---
    isFireMode = false;
    
    // 3. ОБЯЗАТЕЛЬНО очищаем таймер, чтобы он не сработал позже
    clearTimeout(reloadTimerF);
    resetRocketsState('modsu25');
    
    // Возвращаем авторотацию
    viewer.autoRotate = true;
    startAnnotationCycle('modsu25'); 
  }
}
function playBeep() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = 'sine'; // Чистый мягкий звук
    osc.frequency.setValueAtTime(880, context.currentTime); // Высокая нота (Ля 2-й октавы)
    
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();
    osc.stop(context.currentTime + 0.5);
}
let isAudioEnabled = false; // По умолчанию звук выключен

function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const icon = document.getElementById('speaker-icon');
    const text = document.getElementById('speaker-text');
    const btn = document.querySelector('.audio-toggle');
    const ambient = document.getElementById('ambient-sound');

    if (isAudioEnabled) {
        icon.innerText = '🔊';
        text.innerText = 'Звук вкл.';
        btn.classList.add('active');

        // Если мы в ангаре и звук включили — запускаем эффектный гул
        if (ambient) {
            ambient.currentTime = 0; // Сбрасываем на начало
            ambient.volume = 0.4;    // Делаем чуть громче для эффекта "входа"
            ambient.play();           
        } else {
            // Если мы на главной — играем обычный бип
            playBeep();
        }
    } else {
        icon.innerText = '🔇';
        text.innerText = 'Звук выкл.';
        btn.classList.remove('active');
        if (ambient) ambient.pause();
        window.speechSynthesis.cancel(); 
    }
}
let synth = window.speechSynthesis;
function speakCard(element) {
    if (!isAudioEnabled) return; // Если звук выключен — ничего не делаем
    window.speechSynthesis.cancel();
    const title = element.querySelector('h3').innerText;
    const description = element.getAttribute('data-speech') || element.querySelector('p').innerText;    
    const textToSpeak = `${title}. ${description}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Находим все голоса
    const voices = window.speechSynthesis.getVoices();
    
    // Пытаемся найти мужской (Pavel) или Microsoft Dmitry
    const maleVoice = voices.find(v => v.lang.includes('ru') && (v.name.includes('Pavel') || v.name.includes('Dmitry')));
    
    if (maleVoice) {
        utterance.voice = maleVoice;
        utterance.pitch = 0.8; // Для мужского чуть-чуть баса
    } else {
        // ЕСЛИ МУЖСКОГО НЕТ (Осталась только Ирина):
        utterance.pitch = 0.5; // МАКСИМАЛЬНЫЙ БАС (превращает женский в низкий мужской)
    }

    utterance.lang = 'ru-RU';
    utterance.rate = 1.25; // Замедляем, чтобы звучало весомо
    
    window.speechSynthesis.speak(utterance);
}
function speakAnnotation(text) {
    if (!isAudioEnabled) return; // Озвучка сработает, только если включен звук кнопкой
    window.speechSynthesis.cancel(); // Прерываем старую речь
    const utterance = new SpeechSynthesisUtterance(text);    
    const voices = window.speechSynthesis.getVoices();    
    const maleVoice = voices.find(v => v.lang.includes('ru') && (v.name.includes('Pavel') || v.name.includes('Dmitry')));    
    if (maleVoice) {
        utterance.voice = maleVoice;
        utterance.pitch = 0.8; // Для мужского чуть-чуть баса
    } else {        
        utterance.pitch = 0.5; 
    }
    utterance.lang = 'ru-RU';
    utterance.rate = 1.25; 
    window.speechSynthesis.speak(utterance);
}
function stopSpeak() {
    window.speechSynthesis.cancel();
}
function speakDetailedInfo(k) {
    if (!isAudioEnabled || !data[k]) return; 

    // Сначала ПРЕРЫВАЕМ всё, что могло звучать до этого
    window.speechSynthesis.cancel();

    // Даем паузу в 100 миллисекунд перед новым чтением
    setTimeout(() => {
        const textToSpeak = `${data[k].text}.${data[k].history}.${data[k].exhibit}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        const voices = window.speechSynthesis.getVoices();    
        const maleVoice = voices.find(v => v.lang.includes('ru') && (v.name.includes('Pavel') || v.name.includes('Dmitry')));    
        
        if (maleVoice) {
            utterance.voice = maleVoice;
            utterance.pitch = 0.8;
        } else {        
            utterance.pitch = 0.5; 
        }
        
        utterance.lang = 'ru-RU';
        utterance.rate = 1.3; // Для длинного текста лучше чуть помедленнее
        
        window.speechSynthesis.speak(utterance);
        console.log("Команда на чтение отправлена:", data[k].title);
    }, 100); 
}

function startEjectVideo() {
    // Ищем элементы внутри открытого модального окна
    const ov = document.getElementById('video-overlay');
    const vid = document.getElementById('eject-video');
    const skp = document.getElementById('skip-video');

    if (ov && vid) {
        ov.style.display = 'flex'; // Показываем черный фон
        vid.src = "eject.mp4";     // Указываем файл
        vid.muted = !isAudioEnabled; // Звук зависит от твоей кнопки
        
        vid.load(); // Подгружаем файл
        vid.play().catch(err => console.log("Ошибка воспроизведения:", err));

        // Функция закрытия видео
        const stopVid = () => {
            ov.style.display = 'none';
            vid.pause();
            vid.currentTime = 0;
            // Возвращаем камеру Су-33 в исходное состояние
            exitModel('modsu33', 'cabin-trigger', 'eject-button');
        };

        vid.onended = stopVid; // Само закроется в конце
        if (skp) skp.onclick = stopVid; // Закроется при нажатии "Пропустить"
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('three-d-mode-toggle');
    const view2d = document.getElementById('view-2d');
    const view3d = document.getElementById('view-3d');

    if (toggle) {
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                view2d.style.display = 'none';
                view3d.style.display = 'block';
                console.log("Включен 3D режим ангара");
            } else {
                view2d.style.display = 'block';
                view3d.style.display = 'none';
                console.log("Возврат к фото-режиму");
            }
        });
    }
});
// Специальная плавная версия для ангара (без двойных прыжков)
function smoothEnterAngar(viewer, targetPos, targetOrbit) {
    viewer.autoRotate = false;
    viewer.removeAttribute('auto-rotate');
    viewer.interpolationDecay = 150; 
    viewer.fieldOfView = '45deg'; 
    viewer.cameraTarget = targetPos;
    viewer.cameraOrbit = targetOrbit;
    // Текст на случай, если файл не сработает
    const welcomeText = "Добро пожаловать в учебный авиационный ангар МАИ. Здесь представлены легендарные крылатые машины.";
    // Запускаем всё через 2 секунды после начала залёта
    setTimeout(() => {
        if (isAudioEnabled) {
            const welcomeSound = new Audio('welcome.mp3');
            welcomeSound.volume = 0.8;

            // Попытка сыграть твой голос
            welcomeSound.play().catch(error => {
                // ЕСЛИ ФАЙЛ НЕ НАЙДЕН ИЛИ ОШИБКА — ГОВОРИТ ПАВЕЛ
                console.warn("Файл welcome.mp3 не сработал, включаю Павла");
                speakAnnotation(welcomeText); 
            });
        }
        // Проявляем постеры самолетов
        const posters = viewer.querySelectorAll('.plane-poster');
        posters.forEach(p => p.classList.add('visible-poster'));
    }, 2000);
    // ---: Проявление постеров внутри ---    
    setTimeout(() => {
        const posters = viewer.querySelectorAll('.plane-poster');
        posters.forEach(p => p.classList.add('visible-poster'));
    }, 150); 

    setTimeout(() => {
        viewer.interpolationDecay = 100; 
    }, 4000);
}
Video = startEjectVideo;
window.openModelViewer = openModelViewer;
window.closeModelViewer = closeModelViewer;
window.toggleView = toggleView;
window.enterbagage = enterbagage;
window.handleFireClick = handleFireClick;
window.enterSalon = enterSalon;
window.enterCabin = enterCabin;

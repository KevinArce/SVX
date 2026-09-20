/**
 * Bilingual translations dictionary (Spanish and English) for SVX.
 * Preserves proper names of monuments, places, and Salvadoran gastronomy.
 */

export type Language = 'es' | 'en';

export interface TranslationDict {
  ui: Record<string, string>;
  monuments: Record<
    string,
    {
      shortDescription: string;
      architecturalStyle: string;
      visitingHours: string;
      admission: string;
      timeline: Array<{ year: string; event: string }>;
      contentHtml: string;
      heroImageAlt?: string;
    }
  >;
  tours: Record<
    string,
    {
      title: string;
      subtitle: string;
      difficulty: string;
      bestTime: string;
      waypoints: Array<{ walkingTip: string }>;
      contentHtml: string;
    }
  >;
  restaurants: Record<
    string,
    {
      cuisine: string;
      zone: string;
      mustTry: string;
      openHours: string;
      contentHtml: string;
    }
  >;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  es: {
    ui: {
      'site.title': 'SVX — Monumentos y rutas del Centro Histórico de San Salvador',
      'site.description': 'Guía para recorrer a pie el Centro Histórico de San Salvador: monumentos, rutas guiadas y dónde comer cerca.',
      'site.logoAria': 'SVX — ir al inicio',
      'skipLink': 'Saltar al contenido',

      // Navigation
      'nav.home': 'Inicio',
      'nav.monuments': 'Monumentos',
      'nav.tours': 'Tours',
      'nav.gastronomy': 'Gastronomy',
      'nav.menu': 'Menú',
      'nav.aria': 'Navegación principal',

      // Theme toggle
      'theme.label': 'Tema',
      'theme.toggle': 'Alternar modo claro / oscuro',
      'theme.toLight': 'Cambiar a modo claro',
      'theme.toDark': 'Cambiar a modo oscuro',

      // Language toggle
      'lang.aria': 'Selector de idioma / Language selector',
      'lang.toEs': 'Cambiar a español',
      'lang.toEn': 'Switch to English',

      // Home page
      'home.eyebrow': 'San Salvador, El Salvador',
      'home.title': 'El Centro Histórico, a pie',
      'home.description': 'Cuatro monumentos en pocas cuadras, una ruta para recorrerlos en orden y dónde parar a comer sin salir de la zona.',
      'home.ctaRoute': 'Ver la ruta',
      'home.ctaMonuments': 'Explorar monumentos',
      'home.catalogBadge': 'Catálogo',
      'home.catalogTitle': 'Monumentos destacados',
      'home.catalogSubtitle': 'Los sitios que definen el perfil arquitectónico del centro.',
      'home.viewAll': 'Ver todos',
      'home.itineraryBadge': 'Itinerario sugerido',
      'home.itineraryTitle': 'Ruta guiada a pie',
      'home.itinerarySubtitle': 'Un circuito a pie con paradas en orden, tiempos estimados y arquitectura viva.',

      // Monuments page
      'monuments.eyebrow': 'Directorio',
      'monuments.title': 'Monumentos',
      'monuments.description': 'Los monumentos históricos de San Salvador: estilo, año de construcción, horarios y ubicación.',
      'filter.search': 'Buscar',
      'filter.searchPlaceholder': 'Nombre o estilo…',
      'filter.style': 'Estilo',
      'filter.allStyles': 'Todos los estilos',
      'filter.era': 'Época',
      'filter.allEras': 'Todas las épocas',
      'filter.pre1930': 'Antes de 1930',
      'filter.1930_1970': '1930 – 1970',
      'filter.post1970': 'Después de 1970',
      'filter.totalCount': '{count} monumentos registrados',
      'filter.filteredCount': '{visible} de {total} monumentos',
      'filter.empty': 'Ningún monumento coincide con esos filtros.',
      'card.viewDetails': 'Ver ficha →',
      'badge.outsideCenter': 'Fuera del Centro',
      'badge.outsideCenterFull': 'Fuera del Centro Histórico',

      // Monument detail page
      'detail.breadcrumbs': 'Ruta de navegación',
      'detail.specsTitle': 'Ficha técnica',
      'detail.specStyle': 'Estilo',
      'detail.specYear': 'Año',
      'detail.specHours': 'Horario',
      'detail.specAdmission': 'Entrada',
      'detail.free': 'Gratis',
      'detail.timelineTitle': 'Cronología histórica',
      'detail.locationTitle': 'Dónde está',
      'detail.osmLink': 'Ver en OpenStreetMap',
      'detail.osmTabNotice': '(se abre en una pestaña nueva)',
      'detail.nearbyBadge': 'Gastronomía vecina',
      'detail.nearbyTitle': 'Para comer cerca',
      'detail.nearbySubtitle': 'Fichas referenciales: confirmá horarios y ubicación antes de ir.',

      // Tours page
      'tours.eyebrow': 'Recorridos',
      'tours.title': 'Tours guiados',
      'tours.description': 'Rutas a pie por el Centro Histórico de San Salvador, con paradas en orden, tiempos estimados y consejos de caminata.',
      'tourCard.walkingCircuit': 'Circuito a pie',

      // Tour detail page
      'tour.interactiveTitle': 'Exploración interactiva del recorrido',
      'tour.interactiveSubtitle': 'Usa el selector superior para alternar entre la Guía 3D Isométrica y el mapa tradicional. Las paradas están numeradas en el orden de la marcha.',
      'tour.tab3D': 'Guía 3D Isométrica',
      'tour.tab2D': 'Mapa 2D Callejero',
      'tour.desc3D': 'Exploración interactiva Three.js con paradas y tips',
      'tour.desc2D': 'Navegación tradicional OpenStreetMap / Leaflet',
      'tour.itineraryTitle': 'Itinerario y paradas',
      'tour.stopPrefix': 'Parada',
      'tour.viewerLoading': 'Iniciando vista 3D isométrica...',
      'tour.viewerOverview': 'Vista General',
      'tour.viewerFullscreen': 'Pantalla Completa',
      'tour.viewerExitFullscreen': 'Salir Pantalla Completa',
      'tour.viewerStopOf': 'PARADA 0{order} DE 0{total}',
      'tour.viewerStylePrefix': 'Estilo: ',
      'tour.viewerPrev': '← Ant',
      'tour.viewerNext': 'Sig →',
      'tour.viewerDetails': 'Ficha',
      'tour.viewerHint': 'Arrastrar para rotar • Rueda para zoom • Clic en edificio para enfocar',
      'tour.mapAria': 'Mapa interactivo de la ruta',
      'tour.mapError': 'No se pudo cargar el mapa. La lista de paradas sigue disponible más abajo.',
      'tour.mapViewSheet': 'Ver ficha',

      // Gastronomy page
      'gastronomy.eyebrow': 'Dónde comer',
      'gastronomy.title': 'Gastronomía del centro',
      'gastronomy.description': 'Dónde comer cerca de los monumentos del Centro Histórico: pupuserías, café de especialidad y comedores de almuerzo.',
      'gastronomy.alert': 'Estas fichas son referenciales: describen tipos de establecimiento típicos de la zona, no negocios verificados. Confirmá horarios y ubicación antes de ir.',
      'gastronomy.try': 'Probá:',

      // 404 page
      'error.badge': 'Error de navegación',
      'error.title': 'Página no encontrada',
      'error.description': 'La dirección que buscás no existe o cambió de lugar.',
      'error.homeBtn': 'Volver al inicio',
      'error.monumentsBtn': 'Ver monumentos',

      // Footer
      'footer.mission': 'Guía arquitectónica constructivista del Centro Histórico de San Salvador: monumentos, recorridos a pie y gastronomía local.',
      'footer.authorSupport': 'Autor & Apoyo',
      'footer.coffee': 'Invítame un café',
      'footer.coffeeAria': 'Apoyar el proyecto en Buy Me a Coffee',
      'footer.navTitle': 'Navegación',
      'footer.navAria': 'Enlaces del pie de página',
      'footer.copyright': '© {year} SVX. Creado por {author}. Código abierto bajo licencia MIT.',
    },
    monuments: {
      'catedral-metropolitana': {
        shortDescription: 'Templo principal de la arquidiócesis y sitio de la cripta de san Óscar Arnulfo Romero.',
        architecturalStyle: 'Moderno',
        visitingHours: 'Lun–Dom: 7:00–17:00',
        admission: 'Gratis',
        timeline: [
          { year: '1951', event: 'Un incendio destruye el templo que ocupaba el sitio.' },
          { year: '1980', event: 'El funeral de monseñor Romero termina en tragedia en el atrio.' },
          { year: '1997', event: 'Se instala en la fachada el mural Armonía de mi Pueblo, de Fernando Llort.' },
          { year: '1999', event: 'Concluyen las obras del templo actual.' },
          { year: '2011', event: 'El mural de Fernando Llort es retirado de la fachada.' },
        ],
        contentHtml: `<p>La Catedral Metropolitana se ubica frente a la <strong>Plaza Gerardo Barrios</strong>, junto al Palacio Nacional. Es el templo principal de la Arquidiócesis de San Salvador.</p>
<h2>Una construcción interrumpida</h2>
<p>El edificio actual es el resultado de un proceso largo y discontinuo. El templo que ocupaba el sitio fue destruido por un <strong>incendio en 1951</strong>, y la reconstrucción se extendió durante décadas, con pausas prolongadas. Las obras concluyeron en <strong>1999</strong>.</p>
<h2>La fachada y el mural de Fernando Llort</h2>
<p>En <strong>1997</strong> la fachada recibió un mural de azulejos del artista salvadoreño <strong>Fernando Llort</strong>, titulado <em>Armonía de mi Pueblo</em>, compuesto por formas planas y colores saturados característicos de su obra.</p>
<p>El mural fue <strong>retirado en 2011</strong> por decisión de la arquidiócesis, en un episodio que generó una controversia pública considerable en el país. Quien visite hoy la catedral <strong>no encontrará el mural</strong>: la fachada quedó sin esa intervención.</p>
<h2>Memoria de monseñor Romero</h2>
<p>La <strong>cripta</strong> de la catedral alberga la tumba de <strong>san Óscar Arnulfo Romero</strong>, arzobispo de San Salvador asesinado en 1980 y canonizado en 2018. Es un sitio de visita y peregrinación permanente.</p>
<p>La plaza frente al templo fue además escenario de la tragedia ocurrida durante el <strong>funeral de Romero, en marzo de 1980</strong>, cuando una multitud reunida en el atrio quedó atrapada en medio de disparos y explosiones. Es uno de los episodios más documentados del período previo al conflicto armado.</p>
<h2>Al visitarlo</h2>
<p>La cripta tiene acceso independiente y su horario puede ser más corto que el del templo principal. Se pide discreción: es un espacio de culto en uso, no únicamente un sitio patrimonial.</p>`,
      },
      'iglesia-el-rosario': {
        shortDescription: 'Una bóveda de concreto que convierte la luz en espectro de color: la obra moderna más singular del centro.',
        architecturalStyle: 'Brutalismo / Moderno',
        visitingHours: 'Lun–Dom: 7:00–18:00',
        admission: 'Gratis',
        timeline: [
          { year: '1811', event: 'José Matías Delgado encabeza el primer movimiento independentista centroamericano.' },
          { year: '1971', event: 'Se concluye el templo, proyecto de Rubén Martínez.' },
          { year: 'Hoy', event: 'Custodia los restos de José Matías Delgado.' },
        ],
        contentHtml: `<p>La Iglesia El Rosario ocupa el costado oriente de la <strong>Plaza Libertad</strong>. Fue concluida en <strong>1971</strong> según el proyecto del escultor y arquitecto salvadoreño <strong>Rubén Martínez</strong>, y es la obra de arquitectura moderna más reconocida del Centro Histórico.</p>
<h2>Una fachada que engaña</h2>
<p>Desde la calle el edificio no parece una iglesia. Su exterior es una masa de <strong>concreto expuesto</strong>, sin torres, sin ornamento y sin los signos habituales de un templo. Esa austeridad es deliberada: el proyecto reserva todo su efecto para el interior.</p>
<h2>El interior</h2>
<p>La nave se resuelve como una <strong>bóveda de cañón de perfil parabólico</strong>, un único gesto estructural que cubre todo el espacio sin apoyos intermedios. A lo largo de la curva, el concreto se abre en huecos rellenos de <strong>vitrales</strong> ordenados como un espectro continuo de color.</p>
<p>El resultado es que la luz natural entra descompuesta: el color proyectado sobre el piso y los muros <strong>cambia a lo largo del día</strong> según la posición del sol. El edificio funciona, en la práctica, como un instrumento de luz.</p>
<p>El programa escultórico interior —vía crucis y piezas de hierro y concreto— fue trabajado por el mismo autor, de modo que estructura, luz y escultura responden a una sola idea.</p>
<h2>Memoria</h2>
<p>El templo custodia los restos del prócer <strong>José Matías Delgado</strong>, figura central del proceso independentista centroamericano de 1811.</p>
<h2>Al visitarlo</h2>
<p>La visita cambia mucho según la hora. A media mañana y a media tarde el sol entra en ángulo y el efecto del espectro es más intenso que al mediodía.</p>`,
      },
      'palacio-nacional': {
        shortDescription: 'Sede del poder político salvadoreño durante gran parte del siglo XX, frente a la Plaza Gerardo Barrios.',
        architecturalStyle: 'Neoclásico / Renacentista',
        visitingHours: 'Mar–Dom: 9:00–16:00',
        admission: 'Gratis',
        timeline: [
          { year: '1889', event: 'Un incendio destruye el palacio que ocupaba el sitio.' },
          { year: '1911', event: 'Concluye la construcción del edificio actual.' },
          { year: '1986', event: 'El terremoto de San Salvador daña la estructura e inicia un largo proceso de restauración.' },
        ],
        contentHtml: `<p>El Palacio Nacional se levanta en el costado poniente de la <strong>Plaza Gerardo Barrios</strong>, en pleno Centro Histórico de San Salvador. Su construcción se desarrolló durante la primera década del siglo XX y concluyó en <strong>1911</strong>, sobre el terreno que ocupaba un palacio anterior destruido por un incendio a finales del siglo XIX.</p>
<h2>Arquitectura</h2>
<p>El edificio responde al gusto ecléctico de su época: una lectura neoclásica con elementos renacentistas, organizada alrededor de un <strong>patio central</strong> y recorrida por galerías de columnas. La obra incorporó materiales importados, entre ellos mármoles europeos, algo habitual en la arquitectura oficial latinoamericana de esos años.</p>
<p>Su interior conserva cuatro salones principales identificados por el color que los distingue: el <strong>Salón Azul</strong>, el <strong>Salón Rojo</strong>, el <strong>Salón Rosado</strong> y el <strong>Salón Amarillo</strong>. El Salón Azul fue durante décadas la sede de la Asamblea Legislativa.</p>
<h2>Uso e historia</h2>
<p>Durante buena parte del siglo XX el palacio albergó los poderes del Estado y las oficinas de gobierno. Con el traslado de esas dependencias a otras sedes, el inmueble pasó a cumplir funciones de archivo y custodia documental.</p>
<p>Los terremotos que han afectado repetidamente a San Salvador —especialmente el de <strong>1986</strong>— dañaron la estructura y obligaron a sucesivas intervenciones de restauración. El edificio está reconocido como <strong>Monumento Nacional</strong>.</p>
<h2>Al visitarlo</h2>
<p>Conviene recorrer primero el patio central y luego los salones de color, que son lo más representativo del conjunto. La plaza que tiene enfrente permite ver la fachada completa a cierta distancia, algo difícil desde la acera inmediata.</p>
<blockquote><p>Los horarios y el acceso a salones específicos pueden variar según los trabajos de conservación en curso. Conviene confirmar antes de ir.</p></blockquote>`,
      },
      'teatro-nacional': {
        shortDescription: 'Inaugurado en 1917, es el teatro más antiguo de Centroamérica y una joya del renacimiento francés.',
        architecturalStyle: 'Renacentista Francés',
        visitingHours: 'Mar–Dom: 9:00–17:00',
        admission: 'Gratis',
        timeline: [
          { year: '1917', event: 'Se inaugura el teatro el 1 de marzo.' },
          { year: 'S. XX', event: 'Se incorpora el mural de Carlos Cañas a la cúpula de la Sala Principal.' },
          { year: 'Hoy', event: 'Mantiene programación regular de teatro, danza y música.' },
        ],
        contentHtml: `<p>El Teatro Nacional de El Salvador fue inaugurado el <strong>1 de marzo de 1917</strong> y es considerado el <strong>teatro más antiguo de Centroamérica</strong>. Se ubica junto a la Plaza Francisco Morazán, a pocos metros de la Catedral Metropolitana.</p>
<h2>Arquitectura</h2>
<p>El proyecto se atribuye al arquitecto francés <strong>Daniel Beylard</strong>, y el edificio sigue la línea del <strong>renacimiento francés</strong>, con detalles decorativos de inspiración rococó y modernista en sus interiores. La planta se organiza en torno a una sala principal en herradura, con palcos escalonados y un vestíbulo de acceso ornamentado.</p>
<p>La <strong>Sala Principal</strong> es el espacio de mayor jerarquía del conjunto. Su cúpula está cubierta por un mural del pintor salvadoreño <strong>Carlos Cañas</strong>, incorporado en una intervención posterior a la construcción original.</p>
<p>El edificio incluye además salas de menor escala destinadas a cámara, ensayo y exposiciones.</p>
<h2>Historia</h2>
<p>Tras su inauguración, el teatro pasó por períodos de deterioro y cambios de uso que llegaron a comprometer su conservación. Los trabajos de recuperación realizados en la segunda mitad del siglo XX devolvieron al inmueble su función escénica y su carácter patrimonial.</p>
<p>Hoy mantiene programación de teatro, danza y música, y es sede habitual de eventos culturales de la capital.</p>
<h2>Al visitarlo</h2>
<p>El acceso a la Sala Principal depende de la programación del día: si hay ensayo o montaje, puede estar restringido. El vestíbulo y las galerías suelen permanecer abiertos al público en horario de visita.</p>`,
      },
      'monumento-salvador-del-mundo': {
        shortDescription: 'El símbolo más reconocible del país, sobre la Alameda Roosevelt, fuera del Centro Histórico.',
        architecturalStyle: 'Art Déco',
        visitingHours: 'Plaza abierta las 24 horas',
        admission: 'Gratis',
        timeline: [
          { year: '1942', event: 'Se erige el monumento en la Plaza Salvador del Mundo.' },
          { year: 'Hoy', event: 'Es el símbolo más reconocible de la capital y el centro de las Fiestas Agostinas.' },
        ],
        contentHtml: `<p>El Monumento al Divino Salvador del Mundo se levanta en la <strong>Plaza Salvador del Mundo</strong>, en el punto donde la <strong>Alameda Roosevelt</strong> se encuentra con el Paseo General Escalón. Es la imagen más utilizada para representar a San Salvador y al país.</p>
<blockquote><p><strong>Importante para quien camina:</strong> este monumento <strong>no está en el Centro Histórico</strong>. Se encuentra unos <strong>3.5 km al poniente</strong> de la Catedral Metropolitana, un trayecto de más de 40 minutos a pie. No forma parte de la ruta peatonal del centro; conviene llegar en transporte.</p></blockquote>
<h2>El conjunto</h2>
<p>La obra está compuesta por una figura de <strong>Jesucristo sobre un globo terráqueo</strong>, colocada en lo alto de un <strong>pedestal de concreto</strong> de perfil escalonado. El conjunto fue erigido en <strong>1942</strong>.</p>
<p>La composición remite directamente al nombre del país: <em>El Salvador</em>, y a la advocación del <strong>Divino Salvador del Mundo</strong>, patrono de la capital, celebrado en las <strong>Fiestas Agostinas</strong> durante la primera semana de agosto.</p>
<h2>Un lugar de reunión</h2>
<p>La plaza que rodea el monumento funciona desde hace décadas como espacio de concentración pública: celebraciones, manifestaciones y actos multitudinarios. Fue también escenario de las visitas papales realizadas a El Salvador.</p>
<h2>Al visitarlo</h2>
<p>El monumento se aprecia mejor desde la propia plaza, en el perímetro peatonal. Se encuentra sobre una intersección vial de alto tráfico, por lo que conviene usar los cruces señalizados y evitar detenerse en los camellones centrales.</p>`,
      },
    },
    tours: {
      'ruta-del-corazon-historico': {
        title: 'Ruta del Corazón Histórico',
        subtitle: 'Cuatro monumentos y dos plazas, en un circuito a pie que arranca en la Plaza Gerardo Barrios',
        difficulty: 'fácil',
        bestTime: 'Mañana, antes de las 10:00',
        waypoints: [
          { walkingTip: 'Arrancá en la Plaza Gerardo Barrios y ubicate frente a la fachada poniente: es el único punto desde donde se ve completa.' },
          { walkingTip: 'Está a menos de 100 metros, cruzando la misma plaza. La cripta tiene entrada aparte y cierra antes que el templo.' },
          { walkingTip: 'Caminá cuatro cuadras al oriente hasta la Plaza Libertad. No te dejés llevar por la fachada de concreto: lo que importa está adentro.' },
          { walkingTip: 'Regresá hacia la Plaza Morazán. Si hay montaje, la Sala Principal puede estar cerrada, pero el vestíbulo sigue abierto.' },
        ],
        contentHtml: `<p>Esta ruta recorre el núcleo del Centro Histórico de San Salvador. Los cuatro monumentos están separados por <strong>pocas cuadras</strong>, de modo que casi todo el tiempo se va en ver, no en caminar.</p>
<h2>El recorrido</h2>
<p>El punto de encuentro es la <strong>Plaza Gerardo Barrios</strong>, también llamada Plaza Cívica, el espacio abierto que separa el Palacio Nacional de la Catedral Metropolitana. Desde ahí el circuito avanza hacia el oriente hasta la <strong>Plaza Libertad</strong> y regresa hacia la <strong>Plaza Francisco Morazán</strong>, donde está el Teatro Nacional.</p>
<p>Las dos plazas no son tránsito: son parte de la visita. Buena parte de los 2.5 km corresponde a recorrerlas y a rodear los edificios para verlos desde distintos ángulos.</p>
<h2>Cómo aprovecharla</h2>
<ul>
  <li><strong>Salí temprano.</strong> Antes de las 10:00 el sol todavía pega de lado y las fachadas se ven mucho mejor. Después del mediodía el centro se calienta y se llena.</li>
  <li><strong>Llevá agua.</strong> Hay sombra en las plazas, pero los tramos de calle son abiertos.</li>
  <li><strong>Calzado cómodo.</strong> El piso combina adoquín, concreto y bordillos altos.</li>
  <li><strong>Efectivo en billetes pequeños.</strong> Es lo más práctico para comer en el centro.</li>
  <li><strong>Orden recomendado.</strong> Dejar la Iglesia El Rosario para media mañana: la luz entra en ángulo y el efecto de los vitrales es más intenso.</li>
</ul>
<h2>Qué no incluye</h2>
<p>El <strong>Monumento al Divino Salvador del Mundo</strong> no forma parte de esta ruta. Está a unos 3.5 km al poniente, sobre la Alameda Roosevelt, y sumarlo a pie convertiría el circuito en una caminata de más de 40 minutos adicionales por zona de alto tráfico. Si querés verlo el mismo día, conviene hacerlo en transporte, antes o después del recorrido.</p>`,
      },
    },
    restaurants: {
      'cafe-de-altura-centro': {
        cuisine: 'Café de Especialidad',
        zone: 'Frente al Teatro Nacional',
        mustTry: 'Café de origen salvadoreño en método de filtrado, acompañado de quesadilla salvadoreña',
        openHours: 'Lun–Sáb: 8:00–18:00',
        contentHtml: `<p>El café es uno de los cultivos históricos de El Salvador y buena parte de la producción proviene de fincas de altura en las cordilleras del país. Las variedades <strong>Bourbon</strong> y <strong>Pacamara</strong> son las más asociadas con el origen salvadoreño.</p>
<p>Un café de especialidad cerca del Teatro Nacional funciona bien como pausa larga a mitad del recorrido, sobre todo en las horas de más sol.</p>
<h2>Qué esperar</h2>
<ul>
  <li>Métodos de filtrado como V60 o prensa francesa, además de espresso.</li>
  <li>Café de origen local, con la finca y la altura indicadas en la carta.</li>
  <li><strong>Quesadilla salvadoreña</strong>: un panecillo dulce de queso, distinto de la quesadilla mexicana.</li>
</ul>
<h2>Cómo pedir</h2>
<p>Preguntar por el origen del día y por el tueste. Los tuestes claros resaltan la acidez cítrica típica de los cafés de altura.</p>`,
      },
      'comedor-plaza-libertad': {
        cuisine: 'Comedor / Cocina Salvadoreña',
        zone: 'Plaza Libertad',
        mustTry: 'Almuerzo del día: sopa, arroz, frijoles, plátano frito y carne guisada',
        openHours: 'Lun–Vie: 11:00–15:00',
        contentHtml: `<p>Los <strong>comedores</strong> son el formato más común de almuerzo en el centro de San Salvador: menú corto, precio fijo y servicio de mostrador. Se come lo que hay ese día, normalmente una sopa, un plato fuerte y una guarnición.</p>
<p>Su ubicación junto a la Plaza Libertad los vuelve una parada práctica entre la Iglesia El Rosario y el resto del Centro Histórico.</p>
<h2>Qué esperar</h2>
<ul>
  <li><strong>Almuerzo del día</strong> a precio fijo, servido al momento.</li>
  <li>Platos de base: arroz, frijoles, plátano frito, huevo, queso fresco y crema.</li>
  <li>Guisos de res o pollo, y pescado en algunos días de la semana.</li>
</ul>
<h2>Cómo pedir</h2>
<p>Se pregunta por el almuerzo del día y se elige el plato fuerte. El horario fuerte es de 11:30 a 13:30; después de las 14:00 la oferta se reduce.</p>`,
      },
      'pupuseria-del-centro': {
        cuisine: 'Pupusería',
        zone: 'Cerca de Catedral',
        mustTry: 'Pupusas de chicharrón con queso, acompañadas de curtido y salsa de tomate',
        openHours: 'Lun–Sáb: 7:00–19:00',
        contentHtml: `<p>La pupusa es el plato nacional de El Salvador: una tortilla gruesa de maíz rellena y cocida en comal, servida siempre con <strong>curtido</strong> —repollo fermentado con zanahoria y vinagre— y salsa de tomate.</p>
<p>En los alrededores de la Catedral abundan las pupuserías pequeñas, de comal a la vista y atención rápida. Son la parada natural para quien recorre el Centro Histórico a media mañana o al caer la tarde.</p>
<h2>Qué esperar</h2>
<ul>
  <li>Pupusas de <strong>chicharrón</strong>, <strong>queso</strong>, <strong>frijol con queso</strong> y <strong>revueltas</strong>.</li>
  <li>Variantes de arroz, más delgadas y comunes en la zona central del país.</li>
  <li>El curtido y la salsa se sirven aparte y se agregan al gusto.</li>
</ul>
<h2>Cómo pedir</h2>
<p>Se pide por unidad. Dos o tres pupusas suelen ser suficientes para una comida. Conviene preguntar si son de maíz o de arroz antes de ordenar.</p>`,
      },
    },
  },
  en: {
    ui: {
      'site.title': 'SVX — San Salvador Historic Center Monuments & Walking Tours',
      'site.description': 'Constructivist walking guide to San Salvador\'s Historic Center: monuments, self-guided tours, and local dining nearby.',
      'site.logoAria': 'SVX — go to homepage',
      'skipLink': 'Skip to content',

      // Navigation
      'nav.home': 'Home',
      'nav.monuments': 'Monuments',
      'nav.tours': 'Tours',
      'nav.gastronomy': 'Gastronomy',
      'nav.menu': 'Menu',
      'nav.aria': 'Main navigation',

      // Theme toggle
      'theme.label': 'Theme',
      'theme.toggle': 'Toggle light / dark mode',
      'theme.toLight': 'Switch to light mode',
      'theme.toDark': 'Switch to dark mode',

      // Language toggle
      'lang.aria': 'Selector de idioma / Language selector',
      'lang.toEs': 'Cambiar a español',
      'lang.toEn': 'Switch to English',

      // Home page
      'home.eyebrow': 'San Salvador, El Salvador',
      'home.title': 'The Historic Center, on foot',
      'home.description': 'Four monuments within walking distance, an ordered route to explore them, and local dining without leaving the area.',
      'home.ctaRoute': 'View tour',
      'home.ctaMonuments': 'Explore monuments',
      'home.catalogBadge': 'Catalog',
      'home.catalogTitle': 'Featured monuments',
      'home.catalogSubtitle': 'The historic landmarks that define downtown\'s architectural skyline.',
      'home.viewAll': 'View all',
      'home.itineraryBadge': 'Suggested itinerary',
      'home.itineraryTitle': 'Self-guided walking tour',
      'home.itinerarySubtitle': 'A walking circuit with ordered waypoints, estimated times, and vibrant architecture.',

      // Monuments page
      'monuments.eyebrow': 'Directory',
      'monuments.title': 'Monuments',
      'monuments.description': 'Historic monuments of San Salvador: architectural style, construction year, hours, and location.',
      'filter.search': 'Search',
      'filter.searchPlaceholder': 'Name or style…',
      'filter.style': 'Style',
      'filter.allStyles': 'All styles',
      'filter.era': 'Era',
      'filter.allEras': 'All eras',
      'filter.pre1930': 'Before 1930',
      'filter.1930_1970': '1930 – 1970',
      'filter.post1970': 'After 1970',
      'filter.totalCount': '{count} registered monuments',
      'filter.filteredCount': '{visible} of {total} monuments',
      'filter.empty': 'No monuments match these filters.',
      'card.viewDetails': 'View details →',
      'badge.outsideCenter': 'Outside Downtown',
      'badge.outsideCenterFull': 'Outside the Historic Center',

      // Monument detail page
      'detail.breadcrumbs': 'Breadcrumbs',
      'detail.specsTitle': 'Technical sheet',
      'detail.specStyle': 'Style',
      'detail.specYear': 'Year',
      'detail.specHours': 'Hours',
      'detail.specAdmission': 'Admission',
      'detail.free': 'Free',
      'detail.timelineTitle': 'Historical timeline',
      'detail.locationTitle': 'Location',
      'detail.osmLink': 'View on OpenStreetMap',
      'detail.osmTabNotice': '(opens in a new tab)',
      'detail.nearbyBadge': 'Nearby dining',
      'detail.nearbyTitle': 'Where to eat nearby',
      'detail.nearbySubtitle': 'Reference listings: confirm hours and location before visiting.',

      // Tours page
      'tours.eyebrow': 'Walking Routes',
      'tours.title': 'Guided tours',
      'tours.description': 'Walking routes through San Salvador\'s Historic Center, with ordered stops, estimated times, and walking advice.',
      'tourCard.walkingCircuit': 'Walking circuit',

      // Tour detail page
      'tour.interactiveTitle': 'Interactive tour exploration',
      'tour.interactiveSubtitle': 'Use the switcher above to alternate between the 3D Isometric Guide and the street map. Stops are numbered in walking order.',
      'tour.tab3D': '3D Isometric Guide',
      'tour.tab2D': '2D Street Map',
      'tour.desc3D': 'Interactive Three.js exploration with stops and tips',
      'tour.desc2D': 'Standard OpenStreetMap / Leaflet navigation',
      'tour.itineraryTitle': 'Itinerary & stops',
      'tour.stopPrefix': 'Stop',
      'tour.viewerLoading': 'Starting 3D isometric view...',
      'tour.viewerOverview': 'Overview',
      'tour.viewerFullscreen': 'Fullscreen',
      'tour.viewerExitFullscreen': 'Exit Fullscreen',
      'tour.viewerStopOf': 'STOP 0{order} OF 0{total}',
      'tour.viewerStylePrefix': 'Style: ',
      'tour.viewerPrev': '← Prev',
      'tour.viewerNext': 'Next →',
      'tour.viewerDetails': 'Details',
      'tour.viewerHint': 'Drag to rotate • Scroll to zoom • Click building to focus',
      'tour.mapAria': 'Interactive route map',
      'tour.mapError': 'Could not load map. The list of stops remains available below.',
      'tour.mapViewSheet': 'View details',

      // Gastronomy page
      'gastronomy.eyebrow': 'Where to eat',
      'gastronomy.title': 'Downtown gastronomy',
      'gastronomy.description': 'Where to eat near the Historic Center monuments: pupuserías, specialty coffee shops, and local lunch diners.',
      'gastronomy.alert': 'These listings are for reference: they describe typical establishment types in the area rather than verified businesses. Please confirm hours and location before visiting.',
      'gastronomy.try': 'Must try:',

      // 404 page
      'error.badge': 'Navigation error',
      'error.title': 'Page not found',
      'error.description': 'The address you are looking for does not exist or has moved.',
      'error.homeBtn': 'Back to home',
      'error.monumentsBtn': 'View monuments',

      // Footer
      'footer.mission': 'Constructivist architectural guide to San Salvador\'s Historic Center: monuments, self-guided walking tours, and local cuisine.',
      'footer.authorSupport': 'Author & Support',
      'footer.coffee': 'Buy me a coffee',
      'footer.coffeeAria': 'Support the project on Buy Me a Coffee',
      'footer.navTitle': 'Navigation',
      'footer.navAria': 'Footer navigation links',
      'footer.copyright': '© {year} SVX. Created by {author}. Open source under MIT license.',
    },
    monuments: {
      'catedral-metropolitana': {
        shortDescription: 'Principal cathedral of the archdiocese and home to the crypt of Saint Óscar Arnulfo Romero.',
        architecturalStyle: 'Modern',
        visitingHours: 'Mon–Sun: 7:00 AM – 5:00 PM',
        admission: 'Free',
        timeline: [
          { year: '1951', event: 'A catastrophic fire destroys the church that previously occupied the site.' },
          { year: '1980', event: 'Archbishop Romero\'s funeral ends in tragedy in the churchyard.' },
          { year: '1997', event: 'Fernando Llort\'s ceramic tile mural "Armonía de mi Pueblo" is installed on the facade.' },
          { year: '1999', event: 'Construction of the current cathedral structure is finally completed.' },
          { year: '2011', event: 'Fernando Llort\'s mural is removed from the facade by decision of the archdiocese.' },
        ],
        contentHtml: `<p>The Catedral Metropolitana stands directly before <strong>Plaza Gerardo Barrios</strong>, right next to the Palacio Nacional. It serves as the principal temple of the Archdiocese of San Salvador.</p>
<h2>An interrupted construction</h2>
<p>The current building is the culmination of a lengthy and discontinuous construction process. The previous temple that occupied this site was destroyed by a <strong>fire in 1951</strong>, and rebuilding stretched across several decades with prolonged halts. Construction was finally concluded in <strong>1999</strong>.</p>
<h2>The facade and Fernando Llort's mural</h2>
<p>In <strong>1997</strong>, the facade received an iconic ceramic tile mural by celebrated Salvadoran artist <strong>Fernando Llort</strong>, entitled <em>Armonía de mi Pueblo</em>, featuring flat geometric figures and saturated colors characteristic of his style.</p>
<p>The mural was <strong>taken down in 2011</strong> by decision of the archdiocese, triggering widespread public controversy across the country. Visitors to the cathedral today <strong>will not find the mural</strong>: the facade remains without that artwork.</p>
<h2>Memory of Saint Romero</h2>
<p>The cathedral's <strong>crypt</strong> houses the tomb of <strong>Saint Óscar Arnulfo Romero</strong>, the archbishop of San Salvador assassinated in 1980 and canonized in 2018. It serves as an active site of quiet reverence and continuous pilgrimage.</p>
<p>The plaza in front of the cathedral was also the setting of the tragedy that unfolded during <strong>Romero's funeral in March 1980</strong>, when thousands gathered in the churchyard were caught amid gunfire and explosions—one of the most documented events leading into the civil war.</p>
<h2>Visiting advice</h2>
<p>The crypt has an independent side entrance and its operating hours may be shorter than those of the main sanctuary. Visitors are asked for discretion: it is an active sacred space, not solely a heritage site.</p>`,
      },
      'iglesia-el-rosario': {
        shortDescription: 'A concrete parabolic vault transforming natural light into a color spectrum: downtown\'s most unique modern masterwork.',
        architecturalStyle: 'Brutalism / Modern',
        visitingHours: 'Mon–Sun: 7:00 AM – 6:00 PM',
        admission: 'Free',
        timeline: [
          { year: '1811', event: 'José Matías Delgado leads Central America\'s first independence uprising.' },
          { year: '1971', event: 'Construction of the church is completed, designed by Rubén Martínez.' },
          { year: 'Today', event: 'Custodies the resting place and tomb of founding father José Matías Delgado.' },
        ],
        contentHtml: `<p>Iglesia El Rosario stands on the eastern flank of <strong>Plaza Libertad</strong>. It was completed in <strong>1971</strong> under the direction of visionary Salvadoran sculptor and architect <strong>Rubén Martínez</strong>, and is widely regarded as the most internationally recognized modern architecture in the Historic Center.</p>
<h2>A deceiving exterior</h2>
<p>From street level the building hardly resembles a traditional church. Its exterior presents an austere mass of <strong>exposed concrete</strong>, devoid of bell towers, ornament, or traditional ecclesiastical iconography. This restraint is deliberate: the building reserves its entire sensory impact for the interior.</p>
<h2>The interior and light spectrum</h2>
<p>The nave is conceived as a <strong>parabolic barrel vault</strong>—a singular bold structural gesture spanning the entire space without internal supporting columns. Along the curve, the reinforced concrete is punctured by bands of <strong>stained glass</strong> arranged in a continuous color spectrum.</p>
<p>As a result, sunlight enters refracted: the illuminated patterns cast across the floor and textured walls <strong>shift continuously throughout the day</strong> with the trajectory of the sun. In practice, the structure operates like an architectural instrument of light.</p>
<p>The internal sculpture program—including the Stations of the Cross wrought from recycled iron and stone—was crafted by Martínez himself, harmonizing structure, light, and sculpture into one unified concept.</p>
<h2>Historical memory</h2>
<p>The church protects the remains of founding father <strong>José Matías Delgado</strong>, a leading figure of Central America's 1811 independence movement.</p>
<h2>Visiting advice</h2>
<p>The interior atmosphere changes dramatically with the hour. During mid-morning and mid-afternoon the sun strikes at a lower angle, casting the richest rainbow hues along the sanctuary.</p>`,
      },
      'palacio-nacional': {
        shortDescription: 'The seat of Salvadoran political governance through much of the 20th century, overlooking Plaza Gerardo Barrios.',
        architecturalStyle: 'Neoclassical / Renaissance',
        visitingHours: 'Tue–Sun: 9:00 AM – 4:00 PM',
        admission: 'Free',
        timeline: [
          { year: '1889', event: 'A fire completely destroys the previous government palace on the site.' },
          { year: '1911', event: 'Construction of the current neoclassical building is concluded.' },
          { year: '1986', event: 'The San Salvador earthquake causes structural damage, launching a long restoration campaign.' },
        ],
        contentHtml: `<p>The Palacio Nacional rises on the western border of <strong>Plaza Gerardo Barrios</strong>, right in the heart of San Salvador's Historic Center. Its construction progressed during the first decade of the 20th century and concluded in <strong>1911</strong>, on the site of a prior government building destroyed by a fire in the late 19th century.</p>
<h2>Architecture</h2>
<p>The edifice embodies the eclectic sensibilities of its era: a grand neoclassical composition infused with Renaissance revival elements, configured around a <strong>central courtyard</strong> flanked by colonnaded arcades. The project incorporated fine imported materials including European marbles, standard in Latin American civic architecture of the time.</p>
<p>Its interior preserves four ceremonial halls known by their distinctive palette: the <strong>Salón Azul</strong> (Blue Room), the <strong>Salón Rojo</strong> (Red Room), the <strong>Salón Rosado</strong> (Pink Room), and the <strong>Salón Amarillo</strong> (Yellow Room). For decades, the Salón Azul served as the chamber of the Legislative Assembly.</p>
<h2>History & civic role</h2>
<p>Throughout most of the 20th century the palace housed the branches of the Salvadoran state and key government ministries. Following the relocation of these offices, the building shifted to institutional archiving and heritage exhibition.</p>
<p>Repeated earthquakes that have struck San Salvador—most notably in <strong>1986</strong>—damaged sections of the masonry, requiring extensive structural restoration. Today, the palace is officially preserved as a <strong>National Monument</strong>.</p>
<h2>Visiting advice</h2>
<p>It is recommended to explore the central courtyard first before ascending to the historic colored halls. The wide open plaza in front offers the only vantage point to appreciate the full symmetry of its neoclassical facade.</p>
<blockquote><p>Visiting hours and specific hall access may adjust based on ongoing conservation efforts. We recommend checking prior to arrival.</p></blockquote>`,
      },
      'teatro-nacional': {
        shortDescription: 'Inaugurated in 1917, Central America\'s oldest operating theater and a French Renaissance architectural jewel.',
        architecturalStyle: 'French Renaissance',
        visitingHours: 'Tue–Sun: 9:00 AM – 5:00 PM',
        admission: 'Free',
        timeline: [
          { year: '1917', event: 'The theater is officially inaugurated on March 1st.' },
          { year: '20th c.', event: 'Carlos Cañas\'s ceiling mural is integrated into the Main Hall dome.' },
          { year: 'Today', event: 'Maintains ongoing theatrical, dance, and symphonic performances.' },
        ],
        contentHtml: `<p>The Teatro Nacional de El Salvador was opened on <strong>March 1, 1917</strong> and is celebrated as the <strong>oldest operating theater in Central America</strong>. It stands adjacent to Plaza Francisco Morazán, just steps away from the Metropolitan Cathedral.</p>
<h2>Architecture</h2>
<p>The architectural commission is credited to French architect <strong>Daniel Beylard</strong>. The edifice reflects the elegance of the <strong>French Renaissance</strong> revival, embellished with French Rococo and Art Nouveau flourishes in its interior detailing. The floor plan centers around a classic horseshoe-shaped auditorium with tiered private boxes and an ornate entryway vestibule.</p>
<p>The <strong>Main Hall (Sala Principal)</strong> is the crown jewel of the complex. Its ceiling dome features a stunning mural by master Salvadoran painter <strong>Carlos Cañas</strong>, painted during a later restoration.</p>
<p>The facility also includes intimate chamber performance halls, rehearsal spaces, and gallery vestibules.</p>
<h2>History & recovery</h2>
<p>Following its inauguration, the theater weathered periods of wear and varying municipal uses that threatened its historic fabric. Major conservation works in the latter half of the 20th century restored its full performing arts capability and civic grandeur.</p>
<p>Today it hosts an active calendar of theatrical plays, classical dance, and orchestral music, acting as a vibrant anchor for urban cultural life.</p>
<h2>Visiting advice</h2>
<p>Access to the Main Hall is subject to the performance schedule: if a rehearsal is active, interior access may be restricted. The main lobby and upper gallery foyers remain accessible during normal visitor hours.</p>`,
      },
      'monumento-salvador-del-mundo': {
        shortDescription: 'The nation\'s most recognized landmark, located on Alameda Roosevelt, outside the Historic Center.',
        architecturalStyle: 'Art Deco',
        visitingHours: 'Plaza open 24 hours',
        admission: 'Free',
        timeline: [
          { year: '1942', event: 'The monument is officially erected in Plaza Salvador del Mundo.' },
          { year: 'Today', event: 'Remains the definitive national emblem and heart of the August Festivities.' },
        ],
        contentHtml: `<p>The Monumento al Divino Salvador del Mundo stands prominently in <strong>Plaza Salvador del Mundo</strong>, where <strong>Alameda Roosevelt</strong> converges with Paseo General Escalón. It is the most universally recognized icon representing San Salvador and the country.</p>
<blockquote><p><strong>Important note for walkers:</strong> this monument is <strong>not located in the Historic Center</strong>. It sits approximately <strong>3.5 km (2.2 miles) west</strong> of the Metropolitan Cathedral—over a 40-minute walk along busy avenues. It is not part of the downtown pedestrian circuit; taking transit or a taxi is recommended.</p></blockquote>
<h2>The monument ensemble</h2>
<p>The composition consists of a statue of <strong>Jesus Christ standing atop a globe</strong>, elevated upon a stepped <strong>concrete Art Deco pedestal</strong>. The ensemble was dedicated in <strong>1942</strong>.</p>
<p>The iconography directly mirrors the nation's name—<em>El Salvador</em> (The Savior)—and invokes the patronage of the <strong>Divino Salvador del Mundo</strong>, celebrated annually during the <strong>Fiestas Agostinas</strong> in the first week of August.</p>
<h2>A civic gathering ground</h2>
<p>The expansive pedestrian plaza surrounding the monument has served for decades as the city's premier venue for civic gatherings, sporting celebrations, rallies, and papal visits.</p>
<h2>Visiting advice</h2>
<p>The monument is best admired from within the pedestrian boundaries of the plaza itself. Because it is surrounded by a major multi-lane traffic roundabout, always utilize marked pedestrian crossings.</p>`,
      },
    },
    tours: {
      'ruta-del-corazon-historico': {
        title: 'Ruta del Corazón Histórico',
        subtitle: 'Four monuments and two historic plazas, in a walking circuit starting at Plaza Gerardo Barrios',
        difficulty: 'easy',
        bestTime: 'Morning, before 10:00 AM',
        waypoints: [
          { walkingTip: 'Start in Plaza Gerardo Barrios facing the western facade: it is the optimal spot to view the full elevation.' },
          { walkingTip: 'Just 100 meters away across the same plaza. The crypt has its own entrance and closes earlier than the main nave.' },
          { walkingTip: 'Walk four blocks east to Plaza Libertad. Do not be deterred by the concrete facade: the real beauty is inside.' },
          { walkingTip: 'Head back toward Plaza Morazán. If rehearsals are underway the Main Hall may be closed, but the foyer remains open.' },
        ],
        contentHtml: `<p>This walking tour covers the core of San Salvador's Historic Center. All four monuments are separated by <strong>only a few city blocks</strong>, so almost all your time is spent admiring rather than walking.</p>
<h2>The route</h2>
<p>The starting point is <strong>Plaza Gerardo Barrios</strong> (also called Plaza Cívica), the expansive open space linking the Palacio Nacional and Catedral Metropolitana. From there, the circuit heads east to <strong>Plaza Libertad</strong> and loops back toward <strong>Plaza Francisco Morazán</strong>, where the Teatro Nacional sits.</p>
<p>The plazas are destinations in their own right: a good portion of the 2.5 km walk is spent wandering them and viewing the facades from multiple angles.</p>
<h2>Tips for the walk</h2>
<ul>
  <li><strong>Start early.</strong> Before 10:00 AM, the low morning sun highlights the facades beautifully. After midday, downtown heats up and gets crowded.</li>
  <li><strong>Bring water.</strong> The plazas offer shade under trees, but street crossings are exposed.</li>
  <li><strong>Wear comfortable shoes.</strong> Surfaces alternate between cobblestone, concrete slabs, and tall curbs.</li>
  <li><strong>Carry small cash bills.</strong> Essential for refreshments, pupusas, and street treats.</li>
  <li><strong>Recommended timing.</strong> Time your visit to Iglesia El Rosario for mid-morning, when sunlight streams through the stained glass at a dramatic angle.</li>
</ul>
<h2>What is not included</h2>
<p>The <strong>Monumento al Divino Salvador del Mundo</strong> is not part of this walking tour. It is located 3.5 km to the west along Alameda Roosevelt, which would add over 40 minutes of roadside walking. If you wish to visit it on the same day, take public transport or a taxi before or after completing this route.</p>`,
      },
    },
    restaurants: {
      'cafe-de-altura-centro': {
        cuisine: 'Specialty Coffee',
        zone: 'Across from the National Theater',
        mustTry: 'Single-origin Salvadoran pour-over brew, paired with a traditional sweet cheese quesadilla',
        openHours: 'Mon–Sat: 8:00 AM – 6:00 PM',
        contentHtml: `<p>Coffee is one of El Salvador\'s defining agricultural legacies, with much of the highest-quality harvest cultivated on volcanic mountain slopes. The <strong>Bourbon</strong> and <strong>Pacamara</strong> varietals are the most celebrated expressions of Salvadoran terroir.</p>
<p>A specialty coffee stop near the Teatro Nacional makes an ideal prolonged break midway through the tour, especially when escaping the midday sun.</p>
<h2>What to expect</h2>
<ul>
  <li>Filter methods including V60, Chemex, or French press alongside espresso drinks.</li>
  <li>Locally sourced single-origin beans, with farm name and elevation listed on the board.</li>
  <li><strong>Quesadilla salvadoreña</strong>: a rich, sweet, cheese-infused cake distinctive to El Salvador (entirely different from Mexican savory quesadillas).</li>
</ul>
<h2>How to order</h2>
<p>Ask the barista for the featured origin of the day and roast level. Lighter roasts highlight the crisp citrus and floral brightness characteristic of high-altitude beans.</p>`,
      },
      'comedor-plaza-libertad': {
        cuisine: 'Local Diner / Salvadoran Cuisine',
        zone: 'Plaza Libertad',
        mustTry: 'Daily lunch plate: soup, rice, beans, fried sweet plantains, and savory stewed beef or chicken',
        openHours: 'Mon–Fri: 11:00 AM – 3:00 PM',
        contentHtml: `<p>Traditional <strong>comedores</strong> are the cornerstone of midday dining in downtown San Salvador: concise daily menus, fixed affordable pricing, and warm counter service.</p>
<p>Located steps from Plaza Libertad, this spot provides a convenient stop between visiting Iglesia El Rosario and continuing through the center.</p>
<h2>What to expect</h2>
<ul>
  <li><strong>Almuerzo del día</strong> (daily lunch special) prepared and served fresh on the spot.</li>
  <li>Classic Salvadoran sides: seasoned rice, stewed beans, fried sweet plantains, fresh curd cheese, and cream.</li>
  <li>Homestyle stews of beef, chicken, or fish depending on the day of the week.</li>
</ul>
<h2>How to order</h2>
<p>Ask what the specials are for the day and pick your main protein. The peak lunch rush runs from 11:30 AM to 1:30 PM; availability narrows after 2:00 PM.</p>`,
      },
      'pupuseria-del-centro': {
        cuisine: 'Pupusería',
        zone: 'Near the Cathedral',
        mustTry: 'Crispy pork and cheese pupusas ("chicharrón con queso"), served with curtido slaw and tomato sauce',
        openHours: 'Mon–Sat: 7:00 AM – 7:00 PM',
        contentHtml: `<p>The pupusa is the quintessential national dish of El Salvador: a thick handmade corn tortilla stuffed with savory fillings, griddled on a searing comal, and always served with <strong>curtido</strong> (spiced fermented cabbage slaw) and warm tomato sauce.</p>
<p>In the avenues surrounding the cathedral, small family-run pupuserías with visible griddles and quick service abound. They are the natural pause for anyone exploring downtown at breakfast, mid-morning, or dusk.</p>
<h2>What to expect</h2>
<ul>
  <li>Classic fillings: <strong>chicharrón</strong> (seasoned pork), <strong>queso</strong> (melted cheese), <strong>frijol con queso</strong> (refried beans & cheese), and <strong>revueltas</strong> (a combination of all three).</li>
  <li>Rice flour dough options (masa de arroz), prized for their crispier texture.</li>
  <li>Curtido and house salsa are served at the table to add generously to taste.</li>
</ul>
<h2>How to order</h2>
<p>Orders are placed by the individual pupusa; two to three pupusas constitute a satisfying meal. Feel free to specify whether you prefer traditional corn or rice flour dough.</p>`,
      },
    },
  },
};

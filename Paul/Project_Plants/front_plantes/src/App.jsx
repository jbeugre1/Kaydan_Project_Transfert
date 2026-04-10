import { useState, useRef, useCallback } from "react";

const DISEASE_DATA = {
  // ── CAFÉ & CACAO ──
  "cocoa_blackpod": {
    fr: "Pourriture noire du cacao",
    culture: "Cacao",
    healthy: false,
    severity: "high",
    rec: "Symptômes : cabosses avec taches brun-noir humides, molles et parfois recouvertes d'un mycélium grisâtre. Les fruits finissent par se momifier et tomber.\nRecommandations : Éliminez immédiatement les cabosses infectées. Appliquez un fongicide à base de cuivre (bouillie bordelaise). Améliorez le drainage du sol et taillez pour aérer la canopée."
  },
  "cocoa_frostypod": {
    fr: "Moniliose du cacao",
    culture: "Cacao",
    healthy: false,
    severity: "high",
    rec: "Symptômes : cabosses brun clair à brun foncé, zones dures et sèches, pourriture débutant aux extrémités. Des spores blanches ou grisâtres peuvent apparaître en surface.\nRecommandations : Retirez et détruisez toutes les cabosses atteintes. Évitez de les laisser au sol. Appliquez des fongicides préventifs et renforcez la surveillance en saison humide."
  },
  "cocoa_mirid": {
    fr: "Mirides (capsides)",
    culture: "Cacao",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petits insectes verts ou bruns sur les cabosses, taches circulaires ou piqûres, jaunissement autour. Les jeunes fruits peuvent tomber prématurément.\nRecommandations : Traitez avec un insecticide homologué (deltaméthrine, imidaclopride). Taillez les branches basses. Installez des pièges à phéromones."
  },
  "cocoa_normal": {
    fr: "Sain",
    culture: "Cacao",
    healthy: true,
    severity: "none",
    rec: "Symptômes : cabosses uniformes, vertes ou jaunes selon maturité, sans taches ni perforations. Feuilles vertes et saines.\nRecommandations : Aucune intervention requise. Maintenez les bonnes pratiques : taille, fertilisation et surveillance régulière."
  },
  "coffee_browneye": {
    fr: "Œil brun du caféier (Cercospora coffeicola)",
    culture: "Café",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches brunes circulaires sur les feuilles, parfois avec halo jaunâtre. Les taches s'agrandissent et peuvent provoquer la chute des feuilles.\nRecommandations : Appliquez un fongicide à base de cuivre ou de mancozèbe. Évitez l'excès d'humidité sur le feuillage. Retirez les feuilles tombées au sol."
  },
  "coffee_miner": {
    fr: "Mineuse des feuilles du café (Leucoptera coffeella)",
    culture: "Café",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : feuilles avec galeries sinueuses blanchâtres ou translucides dans le tissu foliaire, jaunissement possible, chute prématurée.\nRecommandations : Utilisez des insecticides systémiques (spinosad). Favorisez les auxiliaires naturels. Taillez et brûlez les feuilles fortement infestées."
  },
  "coffee_normal": {
    fr: "Sain",
    culture: "Café",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes et saines, absence de pustules ou taches.\nRecommandations : Plantation en bonne santé. Continuez la surveillance et maintenez une fertilisation azotée équilibrée."
  },
  "coffee_rust": {
    fr: "Rouille du caféier (Hemileia vastatrix)",
    culture: "Café",
    healthy: false,
    severity: "high",
    rec: "Symptômes : petites pustules orangées à rouge vif sur la face inférieure des feuilles, jaunissement progressif, dessèchement et chute des feuilles.\nRecommandations : Appliquez un fongicide triazole ou à base de cuivre dès les premiers symptômes. Taillez pour réduire l'humidité. Utilisez des variétés résistantes lors du renouvellement."
  },

  // ── MANIOC ──
  "bacterial blight": {
    fr: "Bactériose du manioc (Xanthomonas axonopodis pv. manihotis)",
    culture: "Manioc",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles avec taches noires et mouillées sur les bords, parfois entourées de nécrose. Les jeunes pousses se flétrissent et noircissent.\nRecommandations : Utilisez des boutures saines et certifiées. Désinfectez les outils de coupe à l'eau de Javel. Arrachez et brûlez les plants atteints. Évitez de travailler sur plants mouillés."
  },
  "brown spot": {
    fr: "Cercosporiose du manioc (Cercospora henningsii)",
    culture: "Manioc",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches circulaires ou ovales brun clair à brun foncé sur les feuilles. Les bords jaunissent et les feuilles tombent progressivement.\nRecommandations : Appliquez un fongicide préventif à base de mancozèbe ou de chlorothalonil. Assurez une bonne aération entre les plants. Évitez l'irrigation par aspersion en fin de journée."
  },
  "green mite": {
    fr: "Acarien vert du manioc (Mononychellus tanajoa)",
    culture: "Manioc",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches jaunes ou bronzes sur les feuilles, feuilles recroquevillées, chute possible. Présence visible de minuscules acariens verts.\nRecommandations : Introduisez des acariens prédateurs (Typhlodromalus aripo). En cas d'infestation forte, appliquez un acaricide homologué. Évitez les excès d'azote."
  },
  "healthy": {
    fr: "Sain",
    culture: "",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles et tiges uniformes, vertes, sans taches ni déformations.\nRecommandations : Aucune intervention requise. Poursuivez les bonnes pratiques culturales et la surveillance régulière."
  },
  "mosaic": {
    fr: "Mosaïque du manioc (CMD — Cassava Mosaic Disease)",
    culture: "Manioc",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles avec alternance de zones vert clair et vert foncé, déformations ou ondulations possibles. Croissance ralentie.\nRecommandations : Arrachez et détruisez immédiatement les plants malades. Plantez des variétés résistantes homologuées (TMS, IITA). Luttez contre la mouche blanche vectrice avec des insecticides systémiques (imidaclopride)."
  },

  // ── ANACARDE ──
  "anthracnose3102": {
    fr: "Anthracnose de l'anacardier (Colletotrichum gloeosporioides)",
    culture: "Anacarde",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches sombres sur rameaux et feuilles, chancres sur fruits.\nRecommandations : Appliquez du mancozèbe ou du cuivre oxychloride avant et pendant la floraison. Taillez et brûlez les rameaux et feuilles infectés. Évitez les blessures mécaniques."
  },
  "gumosis1714": {
    fr: "Gommose de l'anacardier (Lasiodiplodia theobromae)",
    culture: "Anacarde",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : suintement de gomme sur le tronc et branches, zones noircies autour de la blessure.\nRecommandations : Grattez jusqu'au bois sain et badigeonnez avec de la bouillie bordelaise. Améliorez le drainage. Évitez les excès d'irrigation."
  },
  "leaf miner3466": {
    fr: "Mineuse des feuilles de l'anacardier (Acrocercops syngramma)",
    culture: "Anacarde",
    healthy: false,
    severity: "low",
    rec: "Symptômes : feuilles avec galeries sinueuses blanchâtres, jaunissement léger.\nRecommandations : Appliquez du spinosad ou un insecticide systémique (imidaclopride) sur les jeunes pousses. Ramassez et brûlez les feuilles atteintes. Favorisez la présence de parasitoïdes naturels."
  },
  "red rust4751": {
    fr: "Rouille rouge algaire de l'anacardier (Cephaleuros virescens)",
    culture: "Anacarde",
    healthy: false,
    severity: "low",
    rec: "Symptômes : dépôts rouge-orangé sur feuilles, taches irrégulières.\nRecommandations : Appliquez de la bouillie bordelaise ou un fongicide cuprique en début de saison des pluies. Taillez pour améliorer l'aération. Évitez l'humidité stagnante."
  },
  "healthy5877": {
    fr: "Sain",
    culture: "Anacarde",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles et fruits sains, couleur uniforme.\nRecommandations : Poursuivez les bonnes pratiques culturales et la surveillance régulière."
  },

  // ── TOMATE ──
  // Clés correspondant aux labels du modèle (tels que retournés par l'API)
  "Tomato_YellowLeaf__Curl_Virus": {
    fr: "Virus de l'enroulement jaune des feuilles de tomate (TYLCV)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles enroulées vers le haut et vers l'intérieur, jaunissement marqué des bords et du limbe, réduction de la taille des feuilles, croissance très ralentie, peu ou pas de fruits.\nRecommandations : Arrachez et détruisez immédiatement les plants malades. Luttez sans délai contre la mouche blanche vectrice (Bemisia tabaci) avec de l'imidaclopride ou du thiaméthoxame. Installez des filets insect-proof en début de culture. Utilisez des variétés résistantes certifiées (ex. : Tanya, Lycopersicon hirsutum)."
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    fr: "Virus de l'enroulement jaune des feuilles de tomate (TYLCV)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles enroulées vers le haut et vers l'intérieur, jaunissement marqué des bords et du limbe, réduction de la taille des feuilles, croissance très ralentie, peu ou pas de fruits.\nRecommandations : Arrachez et détruisez immédiatement les plants malades. Luttez sans délai contre la mouche blanche vectrice (Bemisia tabaci) avec de l'imidaclopride ou du thiaméthoxame. Installez des filets insect-proof en début de culture. Utilisez des variétés résistantes certifiées (ex. : Tanya, Lycopersicon hirsutum)."
  },
  "A tomato leaf with Tomato Yellow Leaf Curl Virus": {
    fr: "Virus de l'enroulement jaune des feuilles de tomate (TYLCV)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles enroulées vers le haut et vers l'intérieur, jaunissement marqué des bords et du limbe, réduction de la taille des feuilles, croissance très ralentie, peu ou pas de fruits.\nRecommandations : Arrachez et détruisez immédiatement les plants malades. Luttez sans délai contre la mouche blanche vectrice (Bemisia tabaci) avec de l'imidaclopride ou du thiaméthoxame. Installez des filets insect-proof en début de culture. Utilisez des variétés résistantes certifiées (ex. : Tanya, Lycopersicon hirsutum)."
  },

  "Tomato_Bacterial_spot": {
    fr: "Taches bactériennes de la tomate (Xanthomonas spp.)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches aqueuses vert-jaune sur les feuilles évoluant vers des lésions brun foncé de 2–5 mm, à bords anguleux et centre nécrotique. Peut atteindre les tiges et les fruits (petites taches surélevées puis liégeuses).\nRecommandations : Appliquez de la bouillie bordelaise ou un bactéricide cuprique dès les premiers symptômes. Évitez l'arrosage par aspersion. Utilisez des semences certifiées et traitées. Pratiquez la rotation des cultures sur 2–3 ans. Éliminez et brûlez les débris végétaux après récolte."
  },
  "Tomato___Bacterial_spot": {
    fr: "Taches bactériennes de la tomate (Xanthomonas spp.)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches aqueuses vert-jaune sur les feuilles évoluant vers des lésions brun foncé de 2–5 mm, à bords anguleux et centre nécrotique. Peut atteindre les tiges et les fruits (petites taches surélevées puis liégeuses).\nRecommandations : Appliquez de la bouillie bordelaise ou un bactéricide cuprique dès les premiers symptômes. Évitez l'arrosage par aspersion. Utilisez des semences certifiées et traitées. Pratiquez la rotation des cultures sur 2–3 ans. Éliminez et brûlez les débris végétaux après récolte."
  },
  "A tomato leaf with Bacterial Spot": {
    fr: "Taches bactériennes de la tomate (Xanthomonas spp.)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches aqueuses vert-jaune sur les feuilles évoluant vers des lésions brun foncé de 2–5 mm, à bords anguleux et centre nécrotique. Peut atteindre les tiges et les fruits (petites taches surélevées puis liégeuses).\nRecommandations : Appliquez de la bouillie bordelaise ou un bactéricide cuprique dès les premiers symptômes. Évitez l'arrosage par aspersion. Utilisez des semences certifiées et traitées. Pratiquez la rotation des cultures sur 2–3 ans. Éliminez et brûlez les débris végétaux après récolte."
  },

  "Tomato_Late_blight": {
    fr: "Mildiou de la tomate (Phytophthora infestans)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : grandes taches brun foncé à noires, d'aspect aqueux, sur les feuilles et les tiges ; duvet blanc grisâtre sur la face inférieure des feuilles par temps humide. Les fruits présentent des zones brunes molles et peuvent pourrir rapidement.\nRecommandations : Retirez et brûlez immédiatement toutes les parties infectées. Appliquez un fongicide à base de cymoxanil + mancozèbe ou de métalaxyl. Évitez l'arrosage par aspersion et assurez une bonne aération entre les plants. Pratiquez la rotation des cultures et utilisez des variétés tolérantes."
  },
  "Tomato___Late_blight": {
    fr: "Mildiou de la tomate (Phytophthora infestans)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : grandes taches brun foncé à noires, d'aspect aqueux, sur les feuilles et les tiges ; duvet blanc grisâtre sur la face inférieure des feuilles par temps humide. Les fruits présentent des zones brunes molles et peuvent pourrir rapidement.\nRecommandations : Retirez et brûlez immédiatement toutes les parties infectées. Appliquez un fongicide à base de cymoxanil + mancozèbe ou de métalaxyl. Évitez l'arrosage par aspersion et assurez une bonne aération entre les plants. Pratiquez la rotation des cultures et utilisez des variétés tolérantes."
  },
  "A tomato leaf with Late Blight": {
    fr: "Mildiou de la tomate (Phytophthora infestans)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : grandes taches brun foncé à noires, d'aspect aqueux, sur les feuilles et les tiges ; duvet blanc grisâtre sur la face inférieure des feuilles par temps humide. Les fruits présentent des zones brunes molles et peuvent pourrir rapidement.\nRecommandations : Retirez et brûlez immédiatement toutes les parties infectées. Appliquez un fongicide à base de cymoxanil + mancozèbe ou de métalaxyl. Évitez l'arrosage par aspersion et assurez une bonne aération entre les plants. Pratiquez la rotation des cultures et utilisez des variétés tolérantes."
  },

  "Tomato_Septoria_leaf_spot": {
    fr: "Septoriose de la tomate (Septoria lycopersici)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches circulaires (2–4 mm) brun clair à centre grisâtre sur les feuilles basses en premier, parfois entourées d'un halo jaunâtre. Les feuilles jaunissent et tombent progressivement de la base vers le haut.\nRecommandations : Retirez les feuilles infectées à la base. Appliquez du mancozèbe ou du chlorothalonil toutes les 7–10 jours. Évitez l'arrosage par aspersion en fin de journée et pratiquez la rotation des cultures."
  },
  "Tomato___Septoria_leaf_spot": {
    fr: "Septoriose de la tomate (Septoria lycopersici)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches circulaires (2–4 mm) brun clair à centre grisâtre sur les feuilles basses en premier, parfois entourées d'un halo jaunâtre. Les feuilles jaunissent et tombent progressivement de la base vers le haut.\nRecommandations : Retirez les feuilles infectées à la base. Appliquez du mancozèbe ou du chlorothalonil toutes les 7–10 jours. Évitez l'arrosage par aspersion en fin de journée et pratiquez la rotation des cultures."
  },
  "A tomato leaf with Septoria Leaf Spot": {
    fr: "Septoriose de la tomate (Septoria lycopersici)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches circulaires (2–4 mm) brun clair à centre grisâtre sur les feuilles basses en premier, parfois entourées d'un halo jaunâtre. Les feuilles jaunissent et tombent progressivement de la base vers le haut.\nRecommandations : Retirez les feuilles infectées à la base. Appliquez du mancozèbe ou du chlorothalonil toutes les 7–10 jours. Évitez l'arrosage par aspersion en fin de journée et pratiquez la rotation des cultures."
  },

  "Tomato_Spider_mites_Two_spotted_spider_mite": {
    fr: "Acariens tétranyques de la tomate (Tetranychus urticae)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petits points jaunes ou bronzes sur la face supérieure des feuilles (ponctuation caractéristique), feuilles qui jaunissent et se dessèchent progressivement. Présence de toiles fines sur la face inférieure et entre les feuilles en cas de forte infestation.\nRecommandations : Appliquez un acaricide homologué (abamectine, bifénazate, spiromésifen). Favorisez les acariens prédateurs (Phytoseiulus persimilis) en lutte biologique. Augmentez l'humidité relative autour des plants. Évitez les excès d'azote qui favorisent la multiplication des acariens."
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    fr: "Acariens tétranyques de la tomate (Tetranychus urticae)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petits points jaunes ou bronzes sur la face supérieure des feuilles (ponctuation caractéristique), feuilles qui jaunissent et se dessèchent progressivement. Présence de toiles fines sur la face inférieure et entre les feuilles en cas de forte infestation.\nRecommandations : Appliquez un acaricide homologué (abamectine, bifénazate, spiromésifen). Favorisez les acariens prédateurs (Phytoseiulus persimilis) en lutte biologique. Augmentez l'humidité relative autour des plants. Évitez les excès d'azote qui favorisent la multiplication des acariens."
  },
  "A tomato leaf with Spider Mites Two-spotted Spider Mite": {
    fr: "Acariens tétranyques de la tomate (Tetranychus urticae)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petits points jaunes ou bronzes sur la face supérieure des feuilles (ponctuation caractéristique), feuilles qui jaunissent et se dessèchent progressivement. Présence de toiles fines sur la face inférieure et entre les feuilles en cas de forte infestation.\nRecommandations : Appliquez un acaricide homologué (abamectine, bifénazate, spiromésifen). Favorisez les acariens prédateurs (Phytoseiulus persimilis) en lutte biologique. Augmentez l'humidité relative autour des plants. Évitez les excès d'azote qui favorisent la multiplication des acariens."
  },

  "Tomato_healthy": {
    fr: "Sain",
    culture: "Tomate",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes uniformes, sans taches ni déformations, tiges fermes et bien développées.\nRecommandations : Aucune intervention requise. Maintenez un arrosage régulier au pied, une fertilisation équilibrée et une surveillance hebdomadaire pour détecter précocement tout début d'infection."
  },
  "Tomato___healthy": {
    fr: "Sain",
    culture: "Tomate",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes uniformes, sans taches ni déformations, tiges fermes et bien développées.\nRecommandations : Aucune intervention requise. Maintenez un arrosage régulier au pied, une fertilisation équilibrée et une surveillance hebdomadaire pour détecter précocement tout début d'infection."
  },
  "A healthy tomato leaf": {
    fr: "Sain",
    culture: "Tomate",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes uniformes, sans taches ni déformations, tiges fermes et bien développées.\nRecommandations : Aucune intervention requise. Maintenez un arrosage régulier au pied, une fertilisation équilibrée et une surveillance hebdomadaire pour détecter précocement tout début d'infection."
  },

  "Tomato__Target_Spot": {
    fr: "Tache cible de la tomate (Corynespora cassiicola)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches circulaires brunes avec des anneaux concentriques caractéristiques (aspect « cible »), de 1–2 cm de diamètre sur les feuilles. Possible jaunissement du tissu environnant et chute prématurée des feuilles atteintes.\nRecommandations : Retirez et détruisez les feuilles infectées. Appliquez un fongicide à base d'azoxystrobine, de mancozèbe ou de chlorothalonil. Assurez une bonne aération entre les plants. Évitez l'arrosage par aspersion et pratiquez la rotation des cultures."
  },
  "Tomato___Target_Spot": {
    fr: "Tache cible de la tomate (Corynespora cassiicola)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches circulaires brunes avec des anneaux concentriques caractéristiques (aspect « cible »), de 1–2 cm de diamètre sur les feuilles. Possible jaunissement du tissu environnant et chute prématurée des feuilles atteintes.\nRecommandations : Retirez et détruisez les feuilles infectées. Appliquez un fongicide à base d'azoxystrobine, de mancozèbe ou de chlorothalonil. Assurez une bonne aération entre les plants. Évitez l'arrosage par aspersion et pratiquez la rotation des cultures."
  },
  "A tomato leaf with Target Spot": {
    fr: "Tache cible de la tomate (Corynespora cassiicola)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches circulaires brunes avec des anneaux concentriques caractéristiques (aspect « cible »), de 1–2 cm de diamètre sur les feuilles. Possible jaunissement du tissu environnant et chute prématurée des feuilles atteintes.\nRecommandations : Retirez et détruisez les feuilles infectées. Appliquez un fongicide à base d'azoxystrobine, de mancozèbe ou de chlorothalonil. Assurez une bonne aération entre les plants. Évitez l'arrosage par aspersion et pratiquez la rotation des cultures."
  },

  "Tomato_Early_blight": {
    fr: "Alternariose précoce de la tomate (Alternaria solani)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches brun foncé avec anneaux concentriques sur les feuilles adultes (aspect « cible »), entourées d'un halo jaune. Débute sur les feuilles basses puis remonte vers le haut. Les tiges et les fruits peuvent aussi être touchés.\nRecommandations : Éliminez les feuilles atteintes dès les premiers symptômes. Appliquez du mancozèbe, du chlorothalonil ou de l'azoxystrobine toutes les 7–10 jours en période à risque. Assurez une bonne aération, évitez l'arrosage par aspersion et pratiquez la rotation des cultures sur 2–3 ans."
  },
  "Tomato___Early_blight": {
    fr: "Alternariose précoce de la tomate (Alternaria solani)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches brun foncé avec anneaux concentriques sur les feuilles adultes (aspect « cible »), entourées d'un halo jaune. Débute sur les feuilles basses puis remonte vers le haut. Les tiges et les fruits peuvent aussi être touchés.\nRecommandations : Éliminez les feuilles atteintes dès les premiers symptômes. Appliquez du mancozèbe, du chlorothalonil ou de l'azoxystrobine toutes les 7–10 jours en période à risque. Assurez une bonne aération, évitez l'arrosage par aspersion et pratiquez la rotation des cultures sur 2–3 ans."
  },
  "A tomato leaf with Early Blight": {
    fr: "Alternariose précoce de la tomate (Alternaria solani)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches brun foncé avec anneaux concentriques sur les feuilles adultes (aspect « cible »), entourées d'un halo jaune. Débute sur les feuilles basses puis remonte vers le haut. Les tiges et les fruits peuvent aussi être touchés.\nRecommandations : Éliminez les feuilles atteintes dès les premiers symptômes. Appliquez du mancozèbe, du chlorothalonil ou de l'azoxystrobine toutes les 7–10 jours en période à risque. Assurez une bonne aération, évitez l'arrosage par aspersion et pratiquez la rotation des cultures sur 2–3 ans."
  },

  "Tomato_Leaf_Mold": {
    fr: "Moisissure des feuilles de tomate (Passalora fulva)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches jaune pâle sur la face supérieure des feuilles, avec un feutrage brun-olive à gris-violet caractéristique sur la face inférieure. Les feuilles envahies jaunissent entièrement et tombent. Sévit surtout en conditions chaudes et humides (serres, saison humide).\nRecommandations : Améliorez immédiatement la ventilation (espacement, taille, ouverture des serres). Appliquez un fongicide à base de mancozèbe, de chlorothalonil ou d'azoxystrobine. Évitez l'arrosage par aspersion. Utilisez des variétés résistantes (gène Cf). Éliminez et brûlez les feuilles tombées."
  },
  "Tomato___Leaf_Mold": {
    fr: "Moisissure des feuilles de tomate (Passalora fulva)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches jaune pâle sur la face supérieure des feuilles, avec un feutrage brun-olive à gris-violet caractéristique sur la face inférieure. Les feuilles envahies jaunissent entièrement et tombent. Sévit surtout en conditions chaudes et humides (serres, saison humide).\nRecommandations : Améliorez immédiatement la ventilation (espacement, taille, ouverture des serres). Appliquez un fongicide à base de mancozèbe, de chlorothalonil ou d'azoxystrobine. Évitez l'arrosage par aspersion. Utilisez des variétés résistantes (gène Cf). Éliminez et brûlez les feuilles tombées."
  },
  "A tomato leaf with Leaf Mold": {
    fr: "Moisissure des feuilles de tomate (Passalora fulva)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches jaune pâle sur la face supérieure des feuilles, avec un feutrage brun-olive à gris-violet caractéristique sur la face inférieure. Les feuilles envahies jaunissent entièrement et tombent. Sévit surtout en conditions chaudes et humides (serres, saison humide).\nRecommandations : Améliorez immédiatement la ventilation (espacement, taille, ouverture des serres). Appliquez un fongicide à base de mancozèbe, de chlorothalonil ou d'azoxystrobine. Évitez l'arrosage par aspersion. Utilisez des variétés résistantes (gène Cf). Éliminez et brûlez les feuilles tombées."
  },

  // Anciennes clés tomate conservées pour rétrocompatibilité
  "healthy_tomato": {
    fr: "Sain",
    culture: "Tomate",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes uniformes, sans taches ni déformations, tiges fermes.\nRecommandations : Aucune intervention requise. Maintenez un arrosage régulier au pied, une fertilisation équilibrée et une surveillance hebdomadaire."
  },
  "leaf blight": {
    fr: "Mildiou / Brûlure foliaire de la tomate (Phytophthora infestans)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : grandes taches brun foncé à noir sur les feuilles et tiges, bord aqueux puis sec, pourriture rapide par temps humide. Les fruits peuvent également être atteints.\nRecommandations : Retirez et brûlez immédiatement les parties infectées. Appliquez un fongicide à base de cymoxanil + mancozèbe ou de métalaxyl. Évitez l'arrosage par aspersion et assurez une bonne aération entre plants. Pratiquez la rotation des cultures."
  },
  "leaf curl": {
    fr: "Virus de l'enroulement foliaire de la tomate (TLCV / TYLCV)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : feuilles enroulées vers le haut et vers l'intérieur, jaunissement des bords, réduction de la taille des feuilles, croissance ralentie, fruits peu nombreux.\nRecommandations : Arrachez et détruisez immédiatement les plants malades. Luttez contre la mouche blanche vectrice avec de l'imidaclopride ou du thiaméthoxame. Installez des filets insect-proof. Utilisez des variétés résistantes (ex. : Tanya, Lycopersicon hirsutum)."
  },
  "septoria leaf spot": {
    fr: "Septoriose de la tomate (Septoria lycopersici)",
    culture: "Tomate",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : petites taches circulaires (2–4 mm) brun clair à centre grisâtre sur les feuilles basses en premier, parfois entourées d'un halo jaunâtre. Les feuilles jaunissent et tombent progressivement.\nRecommandations : Retirez les feuilles infectées à la base. Appliquez du mancozèbe ou du chlorothalonil toutes les 7–10 jours. Évitez l'arrosage par aspersion en fin de journée et pratiquez la rotation des cultures."
  },
  "verticillium wilt": {
    fr: "Verticilliose de la tomate (Verticillium dahliae)",
    culture: "Tomate",
    healthy: false,
    severity: "high",
    rec: "Symptômes : jaunissement en forme de V sur les bords des feuilles adultes, flétrissement unilatéral de la plante, brun-jaune visible dans les vaisseaux conducteurs à la coupe de la tige.\nRecommandations : Arrachez et détruisez les plants atteints. Pratiquez une rotation des cultures sur 3–4 ans. Utilisez des variétés résistantes (marqueur VF). Désinfectez le sol à la solarisation ou au métam-sodium. Évitez les excès d'humidité."
  },

  // ── RIZ ──
  "rice_healthy": {
    fr: "Sain",
    culture: "Riz",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes uniformes, dressées, sans taches ni lésions. Tallage normal.\nRecommandations : Aucune intervention requise. Maintenez la gestion de l'eau, la fertilisation azotée fractionnée et la surveillance régulière."
  },
  "blast": {
    fr: "Pyriculariose du riz (Pyricularia oryzae)",
    culture: "Riz",
    healthy: false,
    severity: "high",
    rec: "Symptômes : lésions en forme de losange ou d'œil-de-chat sur les feuilles, centre gris à blanc, bord brun-rouge. Peut atteindre le cou de la panicule (blast du cou) provoquant des panicules vides blanchâtres.\nRecommandations : Appliquez un fongicide triazole (tricyclazole, isoprothiolane) dès les premiers symptômes. Évitez les excès d'azote. Utilisez des variétés résistantes. Assurez une bonne gestion de l'eau en période critique."
  },
  "brown spot_rice": {
    fr: "Helminthosporiose du riz (Bipolaris oryzae)",
    culture: "Riz",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches ovales brun foncé à center grisâtre sur les feuilles, les glumes et les grains. Feuilles jaunissantes avec de nombreuses taches.\nRecommandations : Appliquez du mancozèbe ou de l'iprodione. Assurez une fertilisation potassique suffisante. Utilisez des semences certifiées traitées fongicide. Évitez le stress hydrique."
  },
  "leaf scald": {
    fr: "Échaudure des feuilles du riz (Microdochium oryzae)",
    culture: "Riz",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : lésions en bandes zébrées vert clair et brun clair, à partir des pointes et bords des feuilles, aspect échaudé caractéristique.\nRecommandations : Appliquez un fongicide à base de carbendazime ou de propiconazole. Évitez les excès d'azote. Pratiquez la rotation et utilisez des variétés tolérantes."
  },
  "narrow brown leaf spot": {
    fr: "Cercosporiose du riz (Cercospora janseana)",
    culture: "Riz",
    healthy: false,
    severity: "low",
    rec: "Symptômes : petites taches étroites et allongées brun foncé sur les feuilles, souvent nombreuses mais de petite taille.\nRecommandations : Appliquez du mancozèbe ou du propiconazole. Assurez une fertilisation azotée équilibrée et évitez les stress culturaux."
  },
  "bacterial leaf blight": {
    fr: "Bactériose foliaire du riz (Xanthomonas oryzae pv. oryzae)",
    culture: "Riz",
    healthy: false,
    severity: "high",
    rec: "Symptômes : jaunissement des bords de feuilles qui progresse depuis la pointe, dessèchement en couleur paille, bords ondulés. Exsudat bactérien laiteux visible au matin.\nRecommandations : Utilisez des variétés résistantes. Évitez les excès d'azote. Appliquez du cuivre oxychloride en préventif. Détruisez les résidus de culture après récolte."
  },

  // ── HÉVÉA ──
  "Anthracnose": {
    fr: "Anthracnose de l'hévéa (Colletotrichum gloeosporioides)",
    culture: "Hévéa",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches nécrotiques brun foncé à noires sur les jeunes feuilles, souvent aux bords ou à la pointe. Les feuilles atteintes se recroquevillent, noircissent et tombent prématurément. Les jeunes pousses peuvent être totalement détruites.\nRecommandations : Appliquez un fongicide à base de mancozèbe, de carbendazime ou de cuivre oxychloride lors des périodes de feuillaison. Taillez les rameaux infectés. Assurez une bonne aération de la canopée pour réduire l'humidité foliaire."
  },
  "Dry_Leaf": {
    fr: "Dessiccation foliaire de l'hévéa",
    culture: "Hévéa",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : feuilles brunes, sèches, cassantes, parfois encore accrochées aux rameaux ou tombées au sol. Peut être due à un stress hydrique, un champignon nécrotrophique ou une sénescence prématurée.\nRecommandations : Identifiez la cause : vérifiez l'humidité du sol (stress hydrique) et la présence de pathogènes fongiques. En cas d'origine fongique, appliquez un fongicide adapté. Améliorez la gestion de l'eau et la fertilisation potassique pour renforcer la résistance."
  },
  "Healthy": {
    fr: "Sain",
    culture: "Hévéa",
    healthy: true,
    severity: "none",
    rec: "Symptômes : feuilles vertes, brillantes, bien développées, sans taches ni déformations. Latex d'écoulement normal.\nRecommandations : Aucune intervention requise. Maintenez les bonnes pratiques : fertilisation, encochage régulier et surveillance phytosanitaire périodique."
  },
  "Leaf_Spot": {
    fr: "Taches foliaires de l'hévéa (Corynespora cassiicola / Phytophthora sp.)",
    culture: "Hévéa",
    healthy: false,
    severity: "medium",
    rec: "Symptômes : taches circulaires ou irrégulières brun clair à brun foncé sur les feuilles adultes, parfois entourées d'un halo jaunâtre. En cas de Corynespora, les taches présentent un aspect en cible (anneaux concentriques).\nRecommandations : Appliquez du mancozèbe, du propiconazole ou de l'azoxystrobine selon l'agent pathogène. Retirez et brûlez les feuilles tombées. Évitez les excès d'humidité et assurez une taille d'aération régulière."
  },
};

const SEV = {
  none:   { label: "Sain",   accent: "#4ADE80", dim: "rgba(74,222,128,0.15)",  glow: "rgba(74,222,128,0.3)"  },
  low:    { label: "Faible", accent: "#FCD34D", dim: "rgba(252,211,77,0.15)",  glow: "rgba(252,211,77,0.3)"  },
  medium: { label: "Modéré", accent: "#FB923C", dim: "rgba(251,146,60,0.15)",  glow: "rgba(251,146,60,0.3)"  },
  high:   { label: "Élevé",  accent: "#F87171", dim: "rgba(248,113,113,0.15)", glow: "rgba(248,113,113,0.3)" },
};

const C = {
  hi:      "#F0F0E8",
  mid:     "#C8C8C0",
  lo:      "#9A9A92",
  border:  "rgba(255,255,255,.13)",
  borderB: "rgba(255,255,255,.22)",
  surf:    "rgba(255,255,255,.055)",
};

const CROPS = [
  {
    id: "café_cacao",
    label: "Café & Cacao",
    endpoint: "/predict_model1_café_cacao",
    hugging: false,
    img: "https://cio-mag.com/wp-content/uploads/2023/02/cacao.jpg"
  },
  {
    id: "cassava",
    label: "Manioc",
    endpoint: "/predict_model2_cassava",
    hugging: false,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHCs_tTyb5T49PMZHvbPJrvMkdSFQgbWsouA&s"
  },
  {
    id: "cashew",
    label: "Anacarde",
    endpoint: "/predict_model3_cashew",
    hugging: false,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTB_YBDckqGsAvI1j1BhgSCGVaIv1jOhPn0w&s"
  },
  {
    id: "tomato",
    label: "Tomate",
    endpoint: "/predict_model4_tomato",
    hugging: true,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJMGwVDPdb86RyftWYWqZtJV5Wne26vD3YgA&s"
  },
  {
    id: "rice",
    label: "Riz",
    endpoint: "/predict_model5_rice",
    hugging: true,
    img: "https://cloudfront-eu-central-1.images.arcpublishing.com/lexpress/B3X7XDEJE5F55OQRNLZ4LTVVK4.jpg"
  },
  {
    id: "maize",
    label: "Maïs",
    endpoint: "/predict_model6_maize",
    hugging: true,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtoieu_fW8B9XgWY6DnB3lwoTT5F5mCRcJYw&s"
  },
  {
    id: "rubber",
    label: "Hévéa",
    endpoint: "/predict_model7_rubber_tree",
    hugging: false,
    img: "https://afriksoir.net/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-30-at-08.16.00.jpeg"
  }
];

const PHOTO_TIPS = [
  { icon:"☀️", title:"Lumière naturelle", good:"Photographiez en plein jour, à l'ombre directe",                bad:"Évitez le flash et la lumière artificielle qui faussent les couleurs" },
  { icon:"🎯", title:"Mise au point",     good:"La feuille doit être nette sur toute sa surface",               bad:"Évitez les photos floues ou prises en mouvement" },
  { icon:"📐", title:"Cadrage",           good:"Une seule feuille centrée, occupant 70 % du cadre",             bad:"Évitez plusieurs feuilles superposées dans le même cliché" },
  { icon:"🌿", title:"Choix de feuille",  good:"Préférez une feuille adulte présentant des symptômes visibles", bad:"Évitez les jeunes pousses ou feuilles sèches tombées au sol" },
  { icon:"📏", title:"Distance",          good:"Restez à 15–25 cm de la feuille pour un bon détail",            bad:"Évitez les prises de vue trop lointaines ou trop rapprochées" },
  { icon:"🖼️", title:"Arrière-plan",     good:"Fond neutre (sol, ciel) pour isoler la feuille",                bad:"Évitez les arrière-plans chargés qui perturbent l'analyse" },
];

const BASE_URL = "http://localhost:8000";

const resolve = (raw) => {
  if (!raw) return null;
  if (DISEASE_DATA[raw]) return { ...DISEASE_DATA[raw], raw };
  const found = Object.entries(DISEASE_DATA).find(([k]) => k.toLowerCase() === raw.toLowerCase());
  return found ? { ...found[1], raw } : { fr: raw, culture: "", healthy: false, severity: "medium", rec: "", raw };
};

function RecText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        const match = line.match(/^(Symptômes\s*:|Recommandations\s*:)(.*)/s);
        return (
          <span key={i}>
            {i > 0 && <br />}
            {match ? (
              <>
                <strong style={{ color: "#F0F0E8", fontWeight: 700 }}>{match[1]}</strong>
                <span>{match[2]}</span>
              </>
            ) : (
              line
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function AgriDiagnos() {
  const [step,      setStep]      = useState(1);
  const [crop,      setCrop]      = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL,  setImageURL]  = useState(null);
  const [result,    setResult]    = useState(null);
  const [top3,      setTop3]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [drag,      setDrag]      = useState(false);
  const [tipsOpen,  setTipsOpen]  = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) return;
    setImageFile(file); setImageURL(URL.createObjectURL(file));
    setResult(null); setError(null); setTop3([]);
  }, []);

  const analyze = async () => {
    if (!crop || !imageFile) return;
    setLoading(true); setResult(null); setError(null); setTop3([]);
    try {
      const form = new FormData();
      form.append("img", imageFile);
      const res  = await fetch(`${BASE_URL}${crop.endpoint}`, { method:"POST", body:form });
      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
      const data = await res.json();
      setResult(resolve(data.prediction));
      if (data.probabilities) {
        const probs  = data.probabilities[0];
        const sorted = probs.map((score,idx) => ({ score, idx })).sort((a,b) => b.score - a.score).slice(0,3);
        setTop3(sorted.map((item,rank) => ({ score:item.score, label:rank===0?data.prediction:"—", isTop:rank===0 })));
      } else if (data.probability !== undefined) {
        setTop3([{ score:data.probability, label:data.prediction, isTop:true }]);
      }
      setStep(3);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  };

  const reset = () => {
    setCrop(null); setImageFile(null); setImageURL(null);
    setResult(null); setError(null); setStep(1); setTipsOpen(false); setTop3([]);
  };

  const sev    = result ? SEV[result.severity] : null;
  const canRun = crop && imageFile && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;background:#080C08}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow     {0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes resultIn {from{opacity:0;transform:scale(.97) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tipIn    {from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes barGrow  {from{width:0}to{width:var(--w)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3A3A3A;border-radius:99px}

        .crop-tile{cursor:pointer;transition:all .2s ease;border:none;font-family:'Bricolage Grotesque',sans-serif;overflow:hidden}
        .crop-tile .cimg{transition:transform .4s ease}
        .crop-tile:hover:not(.active-tile) .cimg{transform:scale(1.07)}
        .crop-tile:hover:not(.active-tile){border-color:rgba(255,255,255,.32)!important;transform:translateY(-3px);box-shadow:0 10px 36px rgba(0,0,0,.45)!important}

        .dz-zone{cursor:pointer;transition:all .22s ease}
        .dz-zone:hover{border-color:rgba(255,255,255,.45)!important;background:rgba(255,255,255,.05)!important}
        .cta-btn{font-family:'Bricolage Grotesque',sans-serif;border:none;cursor:pointer;transition:all .2s ease}
        .cta-btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.1)}
        .cta-btn:active:not(:disabled){transform:translateY(0)}
        .ghost-btn{font-family:'Bricolage Grotesque',sans-serif;transition:all .18s ease;cursor:pointer}
        .ghost-btn:hover{background:rgba(255,255,255,.1)!important;color:#D8D8D0!important;border-color:rgba(255,255,255,.28)!important}
        .tips-btn{font-family:'Bricolage Grotesque',sans-serif;transition:all .2s ease;cursor:pointer;border:none}
        .tips-btn:hover{background:rgba(255,255,255,.09)!important;border-color:rgba(255,255,255,.3)!important}
        .tip-card{animation:tipIn .3s ease both}
        .bar-fill{animation:barGrow .95s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#080C08", fontFamily:"'Bricolage Grotesque',sans-serif", color:C.hi, position:"relative", overflow:"hidden" }}>

        <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:700, height:460, background:"radial-gradient(ellipse,rgba(74,222,128,.055) 0%,transparent 70%)", pointerEvents:"none", zIndex:0, animation:"glow 4s ease-in-out infinite" }} />

        <div style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

          {/* ══ NAV ══ */}
          <nav style={{ padding:"1.25rem 2.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, backdropFilter:"blur(16px)", background:"rgba(8,12,8,.85)", position:"sticky", top:0, zIndex:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <div style={{ width:36, height:36, background:"linear-gradient(135deg,#4ADE80,#16A34A)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.15rem", boxShadow:"0 0 22px rgba(74,222,128,.35)" }}>🌱</div>
              <div>
                <p style={{ fontSize:"1rem", fontWeight:800, color:C.hi, letterSpacing:"-0.02em", lineHeight:1 }}>AgriDiagnos</p>
                <p style={{ fontSize:"0.6rem", color:"#4ADE80", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:2 }}>Diagnostic IA</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                {["Culture","Image","Résultat"].map((s,i) => {
                  const n=i+1, done=step>n, active=step===n;
                  return (
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", opacity:active||done?1:0.45 }}>
                        <div style={{ width:22, height:22, borderRadius:999, background:done?"#4ADE80":active?"rgba(74,222,128,.2)":"rgba(255,255,255,.1)", border:active?"1px solid #4ADE80":"1px solid transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, color:done?"#080C08":active?"#4ADE80":C.lo }}>
                          {done?"✓":n}
                        </div>
                        <span style={{ fontSize:"0.76rem", fontWeight:500, color:active?C.hi:done?"#4ADE80":C.lo }}>{s}</span>
                      </div>
                      {i<2&&<div style={{ width:22, height:1, background:"rgba(255,255,255,.18)", marginLeft:"0.2rem" }} />}
                    </div>
                  );
                })}
              </div>
              {(crop||imageURL)&&(
                <button className="ghost-btn" onClick={reset} style={{ padding:"0.45rem 1rem", background:C.surf, border:`1px solid ${C.border}`, borderRadius:8, fontSize:"0.8rem", color:C.lo }}>
                  ↺ Réinitialiser
                </button>
              )}
            </div>
          </nav>

          {/* ══ MAIN ══ */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem 2rem 4rem" }}>

            {/* ── ÉTAPE 1 ── */}
            {step===1&&(
              <>
                <div style={{ textAlign:"center", marginBottom:"3.5rem", animation:"fadeUp .6s ease both" }}>
                  <p style={{ fontSize:"0.7rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"#4ADE80", marginBottom:"1rem", fontWeight:500 }}>
                    Vision artificielle · Phytopathologie
                  </p>
                  <h1 style={{ fontSize:"clamp(3rem,7vw,5.5rem)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:.9, color:C.hi, marginBottom:"1.2rem" }}>
                    Identifiez<br/>
                    <span style={{ color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,.3)" }}>la maladie</span>
                  </h1>
                  <p style={{ fontSize:"1rem", color:C.mid, maxWidth:420, margin:"0 auto", lineHeight:1.75, fontWeight:300 }}>
                    Sélectionnez votre culture, chargez une photo de feuille et obtenez un diagnostic immédiat.
                  </p>
                </div>

                <div style={{ width:"100%", maxWidth:680, animation:"fadeUp .6s .1s ease both", opacity:0, animationFillMode:"forwards" }}>
                  <p style={{ fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.lo, fontWeight:600, marginBottom:"1.4rem", textAlign:"center" }}>
                    Quelle culture analyser ?
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }}>
                    {CROPS.map((c,i) => {
                      const active = crop?.id===c.id;
                      return (
                        <button key={c.id} className={`crop-tile${active?" active-tile":""}`}
                          onClick={() => { setCrop(c); setStep(2); }}
                          style={{ padding:0, background:active?"rgba(74,222,128,.08)":"transparent", border:`1.5px solid ${active?"#4ADE80":C.border}`, borderRadius:16, boxShadow:active?"0 0 28px rgba(74,222,128,.2)":"none", animation:`fadeUp .4s ${i*0.06}s ease both`, animationFillMode:"forwards", opacity:0 }}>
                          <div style={{ width:"100%", aspectRatio:"1/1", borderRadius:"14px 14px 0 0", overflow:"hidden", position:"relative" }}>
                            <img className="cimg" src={c.img} alt={c.label}
                              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                              onError={e => { e.target.style.display="none"; }} />
                            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"45%", background:"linear-gradient(to top,rgba(8,12,8,.75),transparent)", pointerEvents:"none" }} />
                            {active&&(
                              <div style={{ position:"absolute", top:8, right:8, width:20, height:20, borderRadius:999, background:"#4ADE80", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:800, color:"#080C08" }}>✓</div>
                            )}
                          </div>
                          <div style={{ padding:"0.65rem 0.5rem 0.75rem", textAlign:"center" }}>
                            <span style={{ fontSize:"0.83rem", fontWeight:active?700:500, color:active?"#4ADE80":C.mid, letterSpacing:"-0.01em" }}>
                              {c.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── ÉTAPE 2 ── */}
            {step===2&&(
              <div style={{ width:"100%", maxWidth:580, animation:"fadeUp .5s ease both" }}>
                <div style={{ textAlign:"center", marginBottom:"2rem" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"0.7rem", background:C.surf, border:`1px solid ${C.borderB}`, borderRadius:999, padding:"0.35rem 1.1rem 0.35rem 0.4rem", marginBottom:"1.2rem" }}>
                    <div style={{ width:30, height:30, borderRadius:999, overflow:"hidden", flexShrink:0 }}>
                      <img src={crop.img} alt={crop.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    </div>
                    <span style={{ fontSize:"0.88rem", color:"#4ADE80", fontWeight:600 }}>{crop.label}</span>
                  </div>
                  <h2 style={{ fontSize:"1.9rem", fontWeight:800, color:C.hi, letterSpacing:"-0.03em" }}>Chargez une image</h2>
                  <p style={{ fontSize:"0.9rem", color:C.mid, marginTop:"0.5rem" }}>Photographiez une feuille représentative de la plante</p>
                </div>

                <button className="tips-btn" onClick={() => setTipsOpen(!tipsOpen)}
                  style={{ width:"100%", marginBottom:"1rem", padding:"0.9rem 1.2rem", background:tipsOpen?"rgba(74,222,128,.08)":C.surf, border:`1px solid ${tipsOpen?"rgba(74,222,128,.35)":C.borderB}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", color:tipsOpen?"#4ADE80":C.mid, fontSize:"0.88rem", fontWeight:500 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                    <span>📸</span><span>Comment bien photographier ma feuille ?</span>
                  </div>
                  <span style={{ fontSize:"0.75rem", transition:"transform .2s", display:"inline-block", transform:tipsOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
                </button>

                {tipsOpen&&(
                  <div style={{ marginBottom:"1.2rem", background:"rgba(255,255,255,.03)", border:`1px solid ${C.borderB}`, borderRadius:16, padding:"1.5rem", animation:"slideDown .25s ease both" }}>
                    <p style={{ fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#4ADE80", fontWeight:600, marginBottom:"1.2rem" }}>
                      Guide photo · 6 bonnes pratiques
                    </p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                      {PHOTO_TIPS.map((tip,i) => (
                        <div key={i} className="tip-card" style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${C.border}`, borderRadius:12, padding:"1rem", animationDelay:`${i*0.05}s` }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.7rem" }}>
                            <span style={{ fontSize:"1.1rem" }}>{tip.icon}</span>
                            <span style={{ fontSize:"0.82rem", fontWeight:700, color:C.hi }}>{tip.title}</span>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem" }}>
                            <div style={{ display:"flex", gap:"0.4rem", alignItems:"flex-start" }}>
                              <span style={{ color:"#4ADE80", fontSize:"0.75rem", marginTop:"0.05rem", flexShrink:0 }}>✓</span>
                              <p style={{ fontSize:"0.8rem", color:C.mid, lineHeight:1.55 }}>{tip.good}</p>
                            </div>
                            <div style={{ display:"flex", gap:"0.4rem", alignItems:"flex-start" }}>
                              <span style={{ color:"#F87171", fontSize:"0.75rem", marginTop:"0.05rem", flexShrink:0 }}>✕</span>
                              <p style={{ fontSize:"0.8rem", color:C.mid, lineHeight:1.55 }}>{tip.bad}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:"1rem", padding:"0.85rem 1rem", background:"rgba(74,222,128,.07)", border:"1px solid rgba(74,222,128,.22)", borderRadius:10, display:"flex", alignItems:"center", gap:"0.6rem" }}>
                      <span>💡</span>
                      <p style={{ fontSize:"0.8rem", color:"#7ADF95", lineHeight:1.5 }}>
                        <strong>En résumé :</strong> lumière naturelle, feuille adulte symptomatique, centrée et nette, fond neutre, à 15–25 cm.
                      </p>
                    </div>
                  </div>
                )}

                <div className="dz-zone"
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                  style={{ border:`1.5px dashed ${drag?"rgba(255,255,255,.55)":C.borderB}`, borderRadius:20, background:drag?"rgba(255,255,255,.05)":"rgba(255,255,255,.02)", overflow:"hidden", minHeight:imageURL?"auto":200, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.2rem" }}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
                  {imageURL
                    ? <img src={imageURL} alt="aperçu" style={{ width:"100%", maxHeight:320, objectFit:"cover", display:"block" }} />
                    : <div style={{ textAlign:"center", padding:"3rem 2rem" }}>
                        <div style={{ fontSize:"2.5rem", marginBottom:"1rem", opacity:.5 }}>⬆</div>
                        <p style={{ fontSize:"1rem", color:C.mid, marginBottom:"0.35rem" }}>Glissez votre image ici</p>
                        <p style={{ fontSize:"0.78rem", color:C.lo, letterSpacing:"0.1em" }}>JPG · PNG · WEBP</p>
                      </div>
                  }
                </div>

                <div style={{ display:"flex", gap:"0.75rem" }}>
                  <button className="ghost-btn" onClick={() => { setStep(1); setImageFile(null); setImageURL(null); }}
                    style={{ padding:"0.9rem 1.2rem", background:C.surf, border:`1px solid ${C.borderB}`, borderRadius:12, fontSize:"0.88rem", color:C.mid }}>
                    ← Retour
                  </button>
                  <button className="cta-btn" disabled={!canRun} onClick={analyze}
                    style={{ flex:1, padding:"0.9rem", background:canRun?"linear-gradient(135deg,#4ADE80,#16A34A)":"rgba(255,255,255,.06)", borderRadius:12, color:canRun?"#080C08":"#505050", fontSize:"0.95rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem", boxShadow:canRun?"0 4px 28px rgba(74,222,128,.28)":"none" }}>
                    {loading&&<span style={{ width:16, height:16, border:"2.5px solid rgba(8,12,8,.3)", borderTopColor:"#080C08", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />}
                    {loading?"Analyse en cours…":"Lancer le diagnostic →"}
                  </button>
                </div>
                {error&&(
                  <div style={{ marginTop:"1rem", background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.3)", borderRadius:10, padding:"0.85rem 1.1rem", fontSize:"0.85rem", color:"#FCA5A5" }}>
                    ⚠ {error}
                  </div>
                )}
              </div>
            )}

            {/* ── ÉTAPE 3 ── */}
            {step===3&&result&&sev&&(
              <div style={{ width:"100%", maxWidth:860, animation:"resultIn .5s cubic-bezier(.16,1,.3,1) both" }}>

                <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"1.5rem", alignItems:"start" }}>

                  <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <div style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${C.borderB}`, borderRadius:20, overflow:"hidden", boxShadow:`0 0 40px ${sev.glow}` }}>
                      <div style={{ padding:"0.7rem 1rem", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <span style={{ fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.lo, fontWeight:700 }}>🔬 Image analysée</span>
                      </div>
                      {imageURL && (
                        <img
                          src={imageURL}
                          alt="Feuille analysée"
                          style={{ width:"100%", aspectRatio:"1/1", objectFit:"cover", display:"block" }}
                        />
                      )}
                      <div style={{ padding:"0.75rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <div style={{ width:24, height:24, borderRadius:999, overflow:"hidden", flexShrink:0 }}>
                          <img src={crop.img} alt={crop.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                        <span style={{ fontSize:"0.8rem", color:C.mid, fontWeight:600 }}>{crop.label}</span>
                        <div style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:"0.35rem", background:sev.dim, border:`1px solid ${sev.accent}55`, borderRadius:999, padding:"0.25rem 0.7rem" }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:sev.accent, display:"inline-block", boxShadow:`0 0 6px ${sev.accent}` }} />
                          <span style={{ fontSize:"0.7rem", fontWeight:700, color:sev.accent, letterSpacing:"0.08em", textTransform:"uppercase" }}>{sev.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${sev.dim.replace("0.15","0.32")}`, borderRadius:24, overflow:"hidden", boxShadow:`0 0 70px ${sev.glow}, 0 20px 60px rgba(0,0,0,.5)` }}>
                    <div style={{ height:3, background:`linear-gradient(90deg,transparent,${sev.accent},transparent)` }} />
                    <div style={{ padding:"2rem 2rem 1.8rem" }}>

                      <p style={{ fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color:C.lo, marginBottom:"0.5rem", fontWeight:700 }}>
                        Diagnostic
                      </p>
                      <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:800, color:C.hi, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:"1.6rem" }}>
                        {result.fr}
                      </h2>

                      <div style={{ height:1, background:"rgba(255,255,255,.12)", marginBottom:"1.6rem" }} />

                      {top3.length>0&&(
                        <div style={{ marginBottom:"1.6rem" }}>
                          <p style={{ fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color:C.lo, fontWeight:700, marginBottom:"1rem" }}>
                            📊 Scores de confiance
                          </p>
                          <div style={{ display:"flex", flexDirection:"column", gap:"0.9rem" }}>
                            {top3.map((item,i) => {
                              const pct   = Math.round(item.score * 100);
                              const label = item.isTop ? result.fr : (resolve(item.label)?.fr ?? item.label);
                              return (
                                <div key={i}>
                                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                                    <span style={{ fontSize:"0.85rem", color:item.isTop?C.hi:C.mid, fontWeight:item.isTop?700:400, maxWidth:"78%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                      {item.isTop&&<span style={{ color:sev.accent, marginRight:"0.4rem" }}>▶</span>}
                                      {label}
                                    </span>
                                    <span style={{ fontSize:"0.85rem", fontWeight:700, color:item.isTop?sev.accent:C.mid }}>{pct}%</span>
                                  </div>
                                  <div style={{ height:5, background:"rgba(255,255,255,.1)", borderRadius:999, overflow:"hidden" }}>
                                    <div className="bar-fill" style={{ "--w":`${pct}%`, height:"100%", width:`${pct}%`, borderRadius:999, background:item.isTop?`linear-gradient(90deg,${sev.accent}99,${sev.accent})`:"rgba(255,255,255,.3)", animationDelay:`${i*0.1}s` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {crop.hugging&&(
                            <p style={{ fontSize:"0.73rem", color:C.lo, marginTop:"0.8rem", fontStyle:"italic" }}>
                              * Ce modèle ne retourne que le score du top-1.
                            </p>
                          )}
                        </div>
                      )}

                      <div style={{ height:1, background:"rgba(255,255,255,.12)", marginBottom:"1.6rem" }} />

                      <div style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${C.borderB}`, borderRadius:14, padding:"1.4rem 1.6rem" }}>
                        <p style={{ fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color:C.lo, fontWeight:700, marginBottom:"0.8rem" }}>
                          💡 Recommandation agronomique
                        </p>
                        <p style={{ fontSize:"0.93rem", color:C.mid, lineHeight:1.9, fontWeight:300 }}>
                          <RecText text={result.rec} />
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.2rem" }}>
                  <button className="ghost-btn" onClick={() => { setStep(2); setResult(null); setTop3([]); }}
                    style={{ flex:1, padding:"0.85rem", background:C.surf, border:`1px solid ${C.borderB}`, borderRadius:12, fontSize:"0.88rem", color:C.mid }}>
                    ← Nouvelle image
                  </button>
                  <button className="ghost-btn" onClick={reset}
                    style={{ flex:1, padding:"0.85rem", background:C.surf, border:`1px solid ${C.borderB}`, borderRadius:12, fontSize:"0.88rem", color:C.mid }}>
                    ↺ Recommencer
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
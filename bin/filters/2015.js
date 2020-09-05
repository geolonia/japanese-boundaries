const filter = (geojson) => {
  geojson.features = geojson.features.map((feature) => {
    const { properties } = feature;
    const { PREF, CITY } = properties;
    if (PREF === "28" && CITY === "221") {
      // 篠山市 -> 丹波篠山市
      properties.GST_NAME = "丹波篠山市";
      properties.CITY_NAME = "丹波篠山市";
    } else if (PREF === "40" && CITY === "305") {
      // 筑紫郡那珂川町 -> 那珂川市
      properties.CITY = "231";
      properties.KEYCODE1 =
        properties.CITY + properties.KIHON1 + properties.KIHON2;
      properties.KEYCODE2 = properties.KEYCODE2.replace(
        /^[0-9]{3}/,
        properties.CITY
      );
      properties.KEY_CODE = properties.KEN + properties.KEYCODE2;
      properties.CITY_NAME = "那珂川市";
      properties.GST_NAME = "那珂川市";
      properties.CSS_NAME = null;
    } else if (PREF === "04" && CITY === "423") {
      // 黒川郡富谷町 -> 富谷市
      properties.CITY = "216";
      properties.KEYCODE1 =
        properties.CITY + properties.KIHON1 + properties.KIHON2;
      properties.KEYCODE2 = properties.KEYCODE2.replace(
        /^[0-9]{3}/,
        properties.CITY
      );
      properties.KEY_CODE = properties.KEN + properties.KEYCODE2;
      properties.CITY_NAME = "富谷市";
      properties.GST_NAME = "富谷市";
      properties.CSS_NAME = null;
    }
    return feature;
  });

  return geojson;
};

module.exports = filter;

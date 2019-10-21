const axios = require("axios");

const app = async () => {
  const response = await axios("https://api-staging.vello.fi/nutcracker/task");
  const cities = response.data.cities;

  //const cities = CITY_MOCK;

  const cityMap = {};

  cities.forEach(city => {
    const position = parsePosition(city.position);

    cityMap[city.name] = cities.map(c => {
      const p = parsePosition(c.position);
      return {
        distance: distance(position.lat, position.lon, p.lat, p.lon),
        name: c.name
      };
    });

    cityMap[city.name].sort((a, b) => {
      return a.distance - b.distance;
    });
  });

  const route = [];
  let routeDistance = 0;
  function loop(cityName) {
    route.push(cityName);
    const nextCity = cityMap[cityName].find(city => {
      if (cityMap[city.name] && city.distance !== 0) return city;
    });
    delete cityMap[cityName];
    if (Object.values(cityMap).length) {
      routeDistance += nextCity.distance;
      loop(nextCity.name);
    }
  }

  loop(cities[0].name);
  const lastCityPosition = parsePosition(
    cities.find(city => city.name === route[route.length - 1]).position
  );
  const firstCityPosition = parsePosition(cities[0].position);
  route.push(cities[0].name);
  routeDistance += distance(
    lastCityPosition.lat,
    lastCityPosition.lon,
    firstCityPosition.lat,
    firstCityPosition.lon
  );

  /* const payload = {
    path: route,
    distance: routeDistance,
    email: "edit.orosz.office.gmail.com",
    seed: response.data.seed
  }*/

  //console.log(payload);

  const post = await axios
    .post("https://api-staging.vello.fi/nutcracker/return-task", {
      path: route,
      distance: routeDistance,
      email: "edit.orosz.office.gmail.com",
      seed: response.data.seed
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.error(error);
    });
};

function parsePosition(position) {
  const lat = position.latitude.endsWith("N")
    ? parseFloat(position.latitude)
    : -parseFloat(position.latitude);

  const lon = parseFloat(position.longitude);

  return {
    lat,
    lon
  };
}

const distance = (lat1, lon1, lat2, lon2) => {
  var R = 6378.137; //m
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.round(d * 1000);
};

const CITY_MOCK = [
  {
    name: "Firus",
    position: {
      latitude: "18.997817440963413N",
      longitude: "-93.5675347207617"
    }
  },
  {
    name: "Veth",
    position: {
      latitude: "14.296719499010441N",
      longitude: "179.91310648512223"
    }
  },
  {
    name: "Zoa",
    position: { latitude: "82.2814840384248N", longitude: "-58.8909878805207" }
  },
  {
    name: "Åleo",
    position: {
      latitude: "87.09058878558824S",
      longitude: "15.196616677924993"
    }
  },
  {
    name: "Timper",
    position: {
      latitude: "54.44339799024252S",
      longitude: "-76.42354282168714"
    }
  },
  {
    name: "Efri",
    position: {
      latitude: "35.06312257227308S",
      longitude: "-170.90207264185463"
    }
  },
  {
    name: "Dilfa",
    position: { latitude: "46.20665271242294N", longitude: "86.2742381886348" }
  },
  {
    name: "Xyra",
    position: {
      latitude: "85.07382705895385N",
      longitude: "100.29967865714451"
    }
  },
  {
    name: "Leath",
    position: {
      latitude: "47.802681250408675N",
      longitude: "84.23080323469668"
    }
  },
  {
    name: "Yede",
    position: {
      latitude: "78.93476919961375N",
      longitude: "-57.167878409127454"
    }
  },
  {
    name: "Whaly",
    position: {
      latitude: "10.808722665213113N",
      longitude: "-130.8030696810781"
    }
  },
  {
    name: "Gala",
    position: {
      latitude: "68.27622532765247N",
      longitude: "-10.407781730500886"
    }
  },
  {
    name: "Årtan",
    position: { latitude: "19.28574773794886S", longitude: "40.89718026090321" }
  },
  {
    name: "Adebo",
    position: {
      latitude: "19.51860091823294N",
      longitude: "-7.1580288442451945"
    }
  },
  {
    name: "Quane",
    position: { latitude: "75.69846808144231N", longitude: "78.44713852229756" }
  },
  {
    name: "Hampur",
    position: { latitude: "83.3682549446036S", longitude: "42.27789735680662" }
  },
  {
    name: "Bao",
    position: {
      latitude: "74.36631918111887N",
      longitude: "-4.532016341341517"
    }
  }
];

app();

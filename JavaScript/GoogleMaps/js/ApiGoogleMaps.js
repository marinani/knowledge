var GoogleMaps = (function () {

    GoogleMaps.prototype.map;
    GoogleMaps.prototype.infowindow;
    GoogleMaps.prototype.infowindowContent;
    GoogleMaps.prototype.marker;
    GoogleMaps.prototype.autocomplete;

      let geocoder;
      let divIdGoogleMaps;

    GoogleMaps.prototype.endereco = {
        latitude: "",
        longitude: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        numeroEndereco: ""
      };

  function GoogleMaps() { }


    function ControleRegionais(contexto)
    {
        const btnRegionais = document.createElement("button");

        btnRegionais.style.cssText = 'position: absolute; background-color: rgb(255, 255, 255); display: flex; align-items: center; justify-content: center; border: 2px solid rgb(255, 255, 255); border-radius: 2px; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px; color: rgb(25, 25, 25); cursor: pointer; font-family: Roboto, Arial, sans-serif; font-size: 16px; line-height: 38px; padding: 0px; text-align: center; height: 40px; width: 40px; bottom: -223px; right: 70px;';
        btnRegionais.innerHTML = "<i class=' sg-pro-md icon-mapa-curitiba'></i>";
        btnRegionais.title = "Exibir/ocultar divisões de regionais";

        btnRegionais.addEventListener("click", (e) => {
            contexto.MostrarRegionais();
            e.preventDefault();
            return false;
        });


        const divRegionais = document.createElement("div");
        divRegionais.appendChild(btnRegionais);

        return divRegionais;
    }


  GoogleMaps.prototype.IniciarMapa = function (IdGoogleMaps) {

    divIdGoogleMaps = IdGoogleMaps;
    this.map = new google.maps.Map(document.getElementById("map_" + divIdGoogleMaps), {
      center: { lat: -25.4136, lng: -49.2504 },
      zoom: 12,
        rotateControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
            position: google.maps.ControlPosition.RIGHT_TOP,
            style: google.maps.MapTypeControlStyle.DEFAULT
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
      mapTypeId: "roadmap",

    });
    geocoder = new google.maps.Geocoder();
    var card = document.getElementById("endereco-card_" + divIdGoogleMaps);
    var input = document.getElementById("endereco-input_" + divIdGoogleMaps);

    async function waitElement(cssSelector) {
      return new Promise(function (resolve) {
        var timer = window.setInterval(function () {
          window.clearInterval(timer);
          resolve(Array.from($(cssSelector)));
        }, 500);
      });
    }

    ['keyup', 'focus'].forEach(event => input.addEventListener(event, async () => {

      var $items = await waitElement(".pac-container .pac-item");
      //Limitador de cidade, caso queira limitar uma cidade/país/região especifica
      //$items.filter(res => res.textContent.indexOf("Curitiba") == -1).forEach(el => el.remove());
    }));

    // var contornoCuritiba = new google.maps.Polygon({
    //   paths: curitiba,
    //   strokeColor: '#FF0000',  // remover depois
    //   strokeOpacity: 0.9, // remover depois
    //   strokeWeight: 1, // remover depois
    //   fillColor: '#FF0000', // remover depois
    //   fillOpacity: 0.04, // remover depois
    //     map: this.map
    // });

    // contornoCuritiba.setOptions({ visible: false });

    if (!google.maps.Polygon.prototype.getBounds) {
      google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (element, index) { bounds.extend(element); });
        return bounds;
      }
    }

    

    // remover POI
    var noPoi = [{
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }];

    this.map.setOptions({ styles: noPoi });

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(ControleRegionais(this));


    this.InitEventClick();

      this.InitAutocomplete(input,
            {
                fields: ["formatted_address", "geometry", "address_components", "name"],
                strictBounds: true //,
              // bounds: contornoCuritiba.getBounds()
            });

    this.BindLimparEndereco();


  }



  GoogleMaps.prototype.InitEventClick = function () {
    this.map.addListener("click", (mapsMouseEvent) => {
        this.infowindow.close();

        var coordenadasClick = mapsMouseEvent.latLng;

        this.marker.setPosition(coordenadasClick);
        this.marker.setVisible(true);

        var contexto = this;

        geocoder.geocode({ 'latLng': coordenadasClick },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[0])
              {
                var enderecoRetorno = results[0];

                  var retornoGoogle = ParseEndereco(enderecoRetorno);

               

                  contexto.endereco = {
                      latitude: results[0].geometry.location.lat(),
                      longitude: results[0].geometry.location.lng(),
                      logradouro: retornoGoogle.logradouro,
                      bairro: retornoGoogle.bairro,
                      cidade: retornoGoogle.cidade,
                      uf: retornoGoogle.estado,
                      cep: retornoGoogle.cep,
                      numeroEndereco: retornoGoogle.numero
                  };

                  contexto.VerificarIdMaps();

                  contexto.infowindowContent.children["place-name"].textContent = enderecoRetorno.name != null ? enderecoRetorno.name : null;
                  contexto.infowindowContent.children["place-address"].textContent = enderecoRetorno.formatted_address;

                  contexto.infowindow.open(contexto.map, contexto.marker);
            
            }
          }
        });
    });
  }





  GoogleMaps.prototype.InitAutocomplete = function (input, options) {
    this.autocomplete = new google.maps.places.Autocomplete(input, options);

    this.infowindow = new google.maps.InfoWindow();
    this.infowindowContent = document.getElementById("infowindow-content_" + divIdGoogleMaps);

    this.infowindow.setContent(this.infowindowContent);

      
    this.marker = new google.maps.Marker({
        map: this.map,
      anchorPoint: new google.maps.Point(0, -29),
        icon: './images/pin-map.png'
    });
    this.marker.setPosition(null);
    this.marker.setVisible(false);

    this.autocomplete.addListener("place_changed", () => {
      this.infowindow.close();
      this.marker.setVisible(false);
      const place = this.autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
		alert("Não há resultados disponíveis para o endereço: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }



      this.marker.setPosition(place.geometry.location);
      this.marker.setVisible(true);
     
      var retornoGoogle = ParseEndereco(place);
	  
        this.endereco = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            logradouro: retornoGoogle.logradouro,
            bairro: retornoGoogle.bairro,
            cidade: retornoGoogle.cidade,
            uf: retornoGoogle.estado,
            cep: retornoGoogle.cep,
            numeroEndereco: retornoGoogle.numero
        };
     

        this.infowindowContent.children["place-name"].textContent = place.name;
        this.infowindowContent.children["place-address"].textContent = place.formatted_address;

        this.VerificarIdMaps();

        this.infowindow.open(this.map, this.marker);

    });

  }


  GoogleMaps.prototype.RecuperaEndereco = function (ok, sucessFunc) {
    if (!ok) {
      sucessFunc(this.endereco);
    }
    sucessFunc(this.endereco);

  }

    function ParseEndereco(place) {
        const address = {}

        place.address_components.forEach(component => {
            let { long_name, types } = component

            if (types.includes('street_number')) {
                address.numero = long_name.replace("n°", "").trim()
            } else if (types.includes('route')) {
                address.logradouro = long_name
            } else if (types.includes('sublocality')) {
                address.bairro = long_name
            } else if (types.includes('locality')) {
                address.cidade = long_name
            } else if (types.includes('administrative_area_level_2')) {
                address.cidade = long_name
            } else if (types.includes('administrative_area_level_1')) {
                address.estado = long_name
            } else if (types.includes('country')) {
                address.pais = long_name
            } else if (types.includes('postal_code')) {
                address.cep = long_name
            }
        })

        return address
    }


  GoogleMaps.prototype.GetCoordinates = function (enderecoCompleto) {
      var geocoderReverse = new google.maps.Geocoder();

      var contexto = this;
    geocoderReverse.geocode({ 'address': enderecoCompleto }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[0] != null) {

              contexto.infowindow.close();

            var pinLatlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

              var retornoGoogle = ParseEndereco(results[0]);

              contexto.endereco = {
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng(),
                  logradouro: retornoGoogle.logradouro,
                  bairro: retornoGoogle.bairro,
                  cidade: retornoGoogle.cidade,
                  uf: retornoGoogle.estado,
                  cep: retornoGoogle.cep,
                  numeroEndereco: retornoGoogle.numero
              };

          contexto.marker.setPosition(pinLatlng);
          contexto.marker.setVisible(true);
          contexto.map.setZoom(18);
              contexto.map.panTo(contexto.marker.position);
          
          contexto.infowindowContent.children["place-name"].textContent = null;
          contexto.infowindowContent.children["place-address"].textContent = enderecoCompleto;
              contexto.infowindow.open(contexto.map, contexto.marker);
        }
        else {
          new mensagem().Alerta("Dados insuficientes para marcação do endereço, verifique e/ou marque o endereço correto.", 3000);
        }

      }
    });
  }


  GoogleMaps.prototype.SetPin = function (latitude, longitude, enderecoStr, nomeLugar) {

      if (latitude == null || longitude == null)
          return;

    var pinLatlng = new google.maps.LatLng(latitude, longitude);    

    this.marker.setPosition(pinLatlng);
    this.marker.setVisible(true);

    this.map.setZoom(18);
    this.map.panTo(pinLatlng);

    this.infowindow.close();

    this.infowindowContent.children["place-name"].textContent = nomeLugar ?? null;
    this.infowindowContent.children["place-address"].textContent = enderecoStr ?? null;
    this.infowindow.open(this.map, this.marker);

  }


    GoogleMaps.prototype.RemovePin = function () {
        this.infowindow.close();
        this.marker.setVisible(false);
    }


  GoogleMaps.prototype.MontarEndereco = function (objeto, sucessFunc) {
    if (!objeto) {
      sucessFunc(null);
    }
    else {
      this.endereco = {
        latitude: objeto.geometry.viewport.Ab.h,
        longitude: objeto.geometry.viewport.Va.h,
        logradouro: objeto.address_components[1].long_name,
        bairro: objeto.address_components[2].long_name,
        cidade: objeto.address_components[3].long_name,
        uf: objeto.address_components[4].short_name,
        cep: objeto.address_components[6].long_name,
        numeroEndereco: objeto.address_components[0].long_name
      }

      sucessFunc(endereco);
    }

  }

    GoogleMaps.prototype.VerificarIdMaps = function () {
        //Regras aplicadas para cada mapa especifico
        if (this.map.getDiv().id == "map_Atendimento") {
            j("#TpEnderecoMesmoSolicitante").val("false");
            j("#TpEnderecoEquipUrbano").val("false");
            j(".cardEquipamento").addClass("hidden");
            j('#NomeEquipamento').val(null).trigger('change');
            j(".endereco-mapa-container").removeClass("hidden");
            j("#TipoEndereco").val("Manual");
        }
        else if (this.map.getDiv().id == "map_Patrulha") {
            if (j("#Id").val() > 0) {
                j(".atualizarProcesso").removeClass("hidden");
                j(".btnProximo").addClass("hidden");
            }
        }
    }

    GoogleMaps.prototype.BindEndereco = function (enderecoManual) {

        this.endereco = enderecoManual;

    };

    GoogleMaps.prototype.LimparMapa = function (nomeMapa) {

        j("#endereco-input_" + nomeMapa)[0].value = "";
        this.infowindow.close();
        this.marker.setPosition(null);
        this.marker.setVisible(false);
        this.infowindowContent.children["place-name"].textContent = null;
        this.infowindowContent.children["place-address"].textContent = null;
        j(".endereco-mapa-container", "#map_" + nomeMapa).removeClass("hidden");

    };

  GoogleMaps.prototype.MontarStrEndereco = function (obj, sucessFunc) {
    var strEndereco = obj.logradouro + "," + obj.numeroEndereco + " - " + obj.bairro + ", " + obj.cidade + " - " + obj.uf + ", " + obj.cep;

    this.infowindowContent.children["place-address"].textContent = strEndereco;

    sucessFunc(strEndereco);
  }

    GoogleMaps.prototype.BindLimparEndereco = function () {
        var contexto = this;
        $("[id^='endereco-limpar_']").on("click", function (event) {
          j("#endereco-input_" + divIdGoogleMaps)[0].value = "";
          contexto.infowindow.close();
          contexto.marker.setPosition(null);
          contexto.marker.setVisible(false);
          contexto.infowindowContent.children["place-name"].textContent = null;
            contexto.infowindowContent.children["place-address"].textContent = null;
          j(".endereco-mapa-container").removeClass("hidden");
        });
    }


    GoogleMaps.prototype.MostrarRegionais = function () {

        var regionais = this.map.data.getStyle();

        if (regionais == undefined)
            this.map.data.loadGeoJson("./js/regionais.json");

        if (regionais == undefined || regionais.visible == false)
            this.map.data.setStyle({
                fillOpacity: 0,
                strokeWeight: 2,
                clickable: false,
                visible: true
            });
        else
            this.map.data.setStyle({ visible: false });
    }

  let curitiba = [
    {
      "lat": -25.350017815169963,
      "lng": -49.229397005367446
    },
    {
      "lat": -25.390348454617424,
      "lng": -49.19348455886524
    },
    {
      "lat": -25.43562337601793,
      "lng": -49.20334460706795
    },
    {
      "lat": -25.471450119827125,
      "lng": -49.18522482276734
    },
    {
      "lat": -25.538743999935605,
      "lng": -49.22599400042276
    },
    {
      "lat": -25.562029847099723,
      "lng": -49.22331745343769
    },
    {
      "lat": -25.612210906608027,
      "lng": -49.270981556053925
    },
    {
      "lat": -25.615989974757497,
      "lng": -49.3041547251604
    },
    {
      "lat": -25.643164703588184,
      "lng": -49.35991637833814
    },
    {
      "lat": -25.607404918801933,
      "lng": -49.35714264971347
    },
    {
      "lat": -25.580360909128615,
      "lng": -49.34284044073371
    },
    {
      "lat": -25.513216999964527,
      "lng": -49.33963099957094
    },
    {
      "lat": -25.513423911484267,
      "lng": -49.37446296099682
    },
    {
      "lat": -25.485841796062005,
      "lng": -49.38341580639428
    },
    {
      "lat": -25.418878484254606,
      "lng": -49.38348417915148
    },
    {
      "lat": -25.37594826000418,
      "lng": -49.347849977494434
    },
    {
      "lat": -25.349460377594312,
      "lng": -49.34024605041486
    },
    {
      "lat": -25.382387000259826,
      "lng": -49.31199699956181
    },
    {
      "lat": -25.372069675575005,
      "lng": -49.287307878156014
    },
    {
      "lat": -25.34681032283811,
      "lng": -49.272354956615914
    },
    {
      "lat": -25.350017815169963,
      "lng": -49.229397005367446
    }
  ];

  return GoogleMaps;
}());

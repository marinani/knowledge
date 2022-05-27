

//Calculo de ponto de Orvalho
//Exemplo: Se a temperatura ambiente for igual a 30°C e a umidade relativa do ar for igual a 60%,
// seu ponto de orvalho será de 20,5°C.
	public class WeatherDew
    {
        readonly double b = 17.368;
        readonly double c = 238.88;
        readonly double d = 234.5;

        public double Calculate(double temperature, double relativeHumidity)
        {
            double ymTUR = Math.Log((relativeHumidity / 100) * Math.Exp((b - (temperature / d)) * (temperature / (c + temperature))));
            var value = (c * ymTUR) / (b - ymTUR);
            return value;
        }
    }
	

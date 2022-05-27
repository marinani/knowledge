 public static class Extensions
    {
        public static bool IsNullOrEmpty(this string str)
        {
            return string.IsNullOrEmpty(str);
        }
        
        public static bool IsValidJson(string json)
        {
            if (json.IsNullOrEmpty())
                return false;

            json = json.Trim();

            try
            {
                var jToken = JToken.Parse(json);
                var obj = jToken;
                return true;
            }
            catch (JsonReaderException jex)
            {
                Console.WriteLine(jex.Message);
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        public static string StringToJson(this string str, string propertyName)
        {
            if (str.IsNullOrEmpty() || propertyName.IsNullOrEmpty())
                return "{}";

            var dynamicObject = new ExpandoObject() as IDictionary<string, object>;
            dynamicObject.Add(propertyName, str);

            var result = JsonConvert.SerializeObject(dynamicObject, Formatting.Indented, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return result;
        }

        public static int ToInt32(this string str)
        {
            _ = int.TryParse(str, out var resultado);
            return resultado;
        }

    }
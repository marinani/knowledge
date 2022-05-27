 public static class Geral
    {
        public static string ToUrl(string text)
        {
            return text.Replace("+", "1sm2").Replace("/", "1bi2");
        }

        public static string FromUrl(string text)
        {
            return text.Replace("1sm2", "+").Replace("1bi2", "/");
        }
        public static string ApenasNumeros(string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;
            else
                return new string(str.Where(char.IsDigit).ToArray());
        }
        public static string PrimeiroNome(string nome)
        {
            var nomes = nome.Split(' ');

            string primeiroMome = nomes[0];

            return primeiroMome;
        }

        public static string FormatarCpf(string cpf)
        {
            cpf = ApenasNumeros(cpf);

            if (string.IsNullOrEmpty(cpf))
                return string.Empty;
            var retorno = Convert.ToUInt64(cpf).ToString(@"000\.000\.000\-00");
            return retorno;
        }
        public static string FormatarCnpj(string cnpj)
        {
            cnpj = ApenasNumeros(cnpj);

            if (string.IsNullOrEmpty(cnpj))
                return string.Empty;
            if (cnpj[0] == '0')
                return String.Join("", cnpj[0], cnpj[1]) + "." + String.Join("", cnpj[2], cnpj[3], cnpj[4]) + "." + String.Join("", cnpj[5], cnpj[6], cnpj[7])
                    + "/" + String.Join("", cnpj[8], cnpj[9], cnpj[10], cnpj[11]) + "-" + String.Join("", cnpj[12], cnpj[13]);
            else
               return Convert.ToUInt64(cnpj).ToString(@"00\.000\.000\/0000\-00");
        }

        public static string GetEnderecoMAC()
        {
            try
            {
                NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();
                String enderecoMAC = string.Empty;
                foreach (NetworkInterface adapter in nics)
                {
                    // retorna endereço MAC do primeiro cartão
                    if (enderecoMAC == String.Empty)
                    {
                        IPInterfaceProperties properties = adapter.GetIPProperties();
                        enderecoMAC = adapter.GetPhysicalAddress().ToString();
                    }
                }
                return enderecoMAC;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
        public static int CalculaIdadeInt(DateTime dataNascimento)
        {

            int idade = DateTime.Now.Year - dataNascimento.Year;
            //Se o dia de nascimento for superior a data de hoje diminui uma unidade da idade.
            if (DateTime.Now.DayOfYear < dataNascimento.DayOfYear)
            {
                idade--;
            }
            return idade;
        }
        public static string RemoverSegundos(TimeSpan horario)
        {
            return new DateTime(horario.Ticks).ToString("HH:mm");
        }
        public static string ConverterParaJson<T>(T objeto)
        {
            var jsonObjeto = JsonConvert.SerializeObject(objeto, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });

            return jsonObjeto.Trim();
        }
        public static bool ValidarCnpj(string cnpj)
        {
            if (string.IsNullOrEmpty(cnpj))
                return false;

            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma;
            int resto;
            string digito;
            string tempCnpj;

            cnpj = cnpj.Trim();
            cnpj = cnpj.Replace(".", "").Replace("-", "").Replace("/", "");

            if (cnpj.Length != 14)
                return false;

            tempCnpj = cnpj.Substring(0, 12);
            soma = 0;

            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];

            resto = (soma % 11);

            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            digito = resto.ToString();
            tempCnpj += digito;
            soma = 0;

            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];

            resto = (soma % 11);

            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            digito += resto.ToString();

            return cnpj.EndsWith(digito);
        }
        public static bool ValidarCpf(string cpf)
        {
            if (string.IsNullOrEmpty(cpf))
                return false;

            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;

            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            cpf = ApenasNumeros(cpf);

            if (cpf.Length != 11)
                return false;

            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

            resto = soma % 11;

            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            digito = resto.ToString();
            tempCpf += digito;
            soma = 0;

            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

            resto = soma % 11;

            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            digito += resto.ToString();

            return cpf.EndsWith(digito);
        }
        public static bool IsCpf(string cpf)
        {
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;
            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            if (cpf.Length != 11)
                return false;
            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf += digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito += resto.ToString();
            return cpf.EndsWith(digito);
        }
        public static bool IsCnpj(string cnpj)
        {
            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma;
            int resto;
            string digito;
            string tempCnpj;
            cnpj = cnpj.Trim();
            cnpj = cnpj.Replace(".", "").Replace("-", "").Replace("/", "");
            if (cnpj.Length != 14)
                return false;
            tempCnpj = cnpj.Substring(0, 12);
            soma = 0;
            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCnpj += digito;
            soma = 0;
            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito += resto.ToString();
            return cnpj.EndsWith(digito);
        }
        public static string FormatarEndereco(string logradouro, int? numero, string bairro, string cidade, string uf)
        {
            var enderecoFormatado = string.Empty;

            if (!string.IsNullOrEmpty(logradouro))
            {
                enderecoFormatado = $"{logradouro}";
            }

            if (numero == null || numero == 0)
            {
                enderecoFormatado += $", S/N";
            }
            else
            {
                enderecoFormatado += $", {numero}";
            }

            if (!string.IsNullOrEmpty(bairro))
            {
                enderecoFormatado += $" - {bairro}";
            }

            if (!string.IsNullOrEmpty(cidade))
            {
                enderecoFormatado += $", {cidade}";
            }

            if (!string.IsNullOrEmpty(uf))
            {
                enderecoFormatado += $" - {uf}";
            }

            enderecoFormatado = enderecoFormatado.ToLower();

            return enderecoFormatado;
        }
        public static bool VerificaEquipamentoUrbanoAberto(TimeSpan inicio, TimeSpan fim, int dia)
        {
            var horaAtual = DateTime.Now.TimeOfDay;
            var diaSemanaHoje = (int)DateTime.Today.DayOfWeek;

            return (inicio <= horaAtual && fim >= horaAtual && diaSemanaHoje == dia);
        }

        public static bool VerificaEquipamentoUrbanoAberto(TimeSpan inicio, TimeSpan fim)
        {
            var horaAtual = DateTime.Now.TimeOfDay;

            return (inicio <= horaAtual && fim >= horaAtual);
        }
        public static string ArquivoParaBase64(IFormFile arquivo)
        {
            var atestadoBase64 = string.Empty;
            if (arquivo.Length > 0)
            {
                using var ms = new MemoryStream();
                arquivo.CopyTo(ms);
                var fileBytes = ms.ToArray();
                atestadoBase64 = Convert.ToBase64String(fileBytes);
            }
            return atestadoBase64;
        }

        public static List<KeyValuePair<int, string>> GetEnumValuesAndDescriptions<T>()
        {
            Type enumType = typeof(T);

            if (enumType.BaseType != typeof(Enum))
                throw new ArgumentException("T is not System.Enum");

            List<KeyValuePair<int, string>> enumValList = new List<KeyValuePair<int, string>>();

            foreach (var e in Enum.GetValues(typeof(T)))
            {
                var fi = e.GetType().GetField(e.ToString());

                enumValList.Add(new KeyValuePair<int, string>((int)e, e.ToString()));
            }

            return enumValList;
        }

        public static List<KeyValuePair<int, string>> GetEnumValuesAndDisplayNames<T>()
        {
            Type enumType = typeof(T);

            if (enumType.BaseType != typeof(Enum))
                throw new ArgumentException("T is not System.Enum");

            List<KeyValuePair<int, string>> enumValList = new List<KeyValuePair<int, string>>();

            foreach (var e in Enum.GetValues(typeof(T)))
            {
                var fi = e.GetType().GetField(e.ToString());

                enumValList.Add(new KeyValuePair<int, string>((int)e, fi.Name));
            }

            return enumValList;
        }

        public static string FormatarTelefone(string telefone)
        {
            telefone = ApenasNumeros(telefone);

            if (string.IsNullOrEmpty(telefone))
                return string.Empty;
            else
            {
                if (telefone.Length == 10)
                    return Convert.ToUInt64(telefone).ToString(@"(00) 0000-0000");
                else
                    return Convert.ToUInt64(telefone).ToString(@"(00) 00000-0000");
            }
        }
    }
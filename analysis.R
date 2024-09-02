library(tidyverse)
library(readxl)
library(lubridate)
library(colorspace)
library(extrafont)
library(zoo)

Sys.setlocale(locale = "pt-BR")
#readxl::excel_sheets('./data/sh-rtn.xlsx')
raw_data <- read_excel('./data/sh-rtn.xlsx', sheet = "1.1-A", skip = 4)

data_010 <- raw_data %>% 
  gather(-1, key = "Date", value = "value") %>%
  mutate(Date = as.Date(as.numeric(Date), origin = "1899-12-30"))

result <- data_010 %>%
  filter(Discriminação == "5. RESULTADO PRIMÁRIO GOVERNO CENTRAL - ACIMA DA LINHA (3 - 4)") %>%
  select(-1) %>%
  mutate(month = lubridate::month(Date),
         month_name = lubridate::month(Date, label = T),
         year = lubridate::year(Date))

ggplot(result, aes(x = Date, y = value, 
                   color = value > 0,
                   fill = value > 0)) +
  geom_point() +
  geom_col() +
  theme_minimal()

# resultado mes a mes
ggplot(result, aes(x = Date, y = value)) +
  geom_line() +
  theme_minimal()

ggplot(result, aes(x = Date, y = value)) +
  geom_col() +
  geom_point() +
  theme_minimal()

ggplot(result, aes(x = year, y = month_name, fill = -value))+
                   #fill = value > 0, alpha = abs(value))) +
  geom_tile(color = "white") +
  scale_fill_continuous_diverging(palette = "Blue-Red") +
  theme_minimal()

ggplot(result, aes(
  x = month_name, 
  y = year, 
  color = value > 0, 
  size = abs(value)) ) +
  #fill = value > 0, alpha = abs(value))) +
  geom_point() +
  theme_minimal()


reslt_acum <- result %>%
  mutate(
    tot = cumsum(value),
    tot12m = zoo::rollsum(value, k = 12, fill = NA, align = "right"),
    tot48m = zoo::rollsum(value, k = 48, fill = NA, align = "right")
  )

ggplot(reslt_acum) +
  geom_line(aes(x = Date, y = value)) +
  geom_line(aes(x = Date, y = tot12m), color = "blue") +
  geom_line(aes(x = Date, y = tot), color = "red") +
  geom_line(aes(x = Date, y = tot48m), color = "green")

mudancas_governo <- data.frame(
  dates = lubridate::ymd(
  c(
    "1997/01/01",
    "1999/01/01", 
    "2003/01/01", 
    "2007/01/01", 
    "2011/01/01", 
    "2015/01/01",
    "2016/08/31",
    "2019/01/01", 
    "2023/01/01"
  )),
  presidentes = c(
    "FHC",
    "FHC",
    "Lula",
    "Lula",
    "Dilma",
    "Dilma",
    "Temer",
    "Bolsonaro",
    "Lula"
  ))

value_fev_2020 <- reslt_acum %>% filter(month == 2, year == 2020) %>% .$tot

ggplot(reslt_acum %>% filter(Date <= as.Date("2023-12-31"))) +
  geom_text(data = mudancas_governo, aes(label = presidentes, x = dates), y = 2.2*1000000, size = 2.5, hjust = "left", nudge_x = 50, family = "Work Sans") +
  geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue", alpha = 1) +
  geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  annotate(geom = "rect",
           xmin = lubridate::ymd("2020/02/01"),
           xmax = lubridate::ymd("2021/07/01"),
           ymin = 0, ymax = value_fev_2020,
           alpha = 0, color = "#B54B47", fill = "transparent"
  ) +
  geom_vline(data = mudancas_governo, aes(xintercept = dates), size = .7, linetype = "dotted", color = "#B58A47") +
  annotate(geom = "text", x = as.Date("2020-02-01"), y = value_fev_2020 + 5e4, hjust = "left", vjust = "bottom", label = "Pandemia", family = "Work Sans", size = 3, color = "#B54B47") + 
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado: 1997 a 2023", subtitle = "R$ trilhões - valores a preços de junho de 2024 - IPCA", caption = "Fonte: STN / Série Histórica do Resultado do Tesouro Nacional, tabela 1.1-A, junho de 2024") +
  scale_y_continuous(labels = function(x) {format(x/1000000, big.mark = ".", decimal.mark = ",")}) +
  theme_minimal() +
  theme(
    text = element_text(family = "Work Sans"),
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank())

ggsave("acumulado.png", width = 8.5, height = 5, bg = "white")

ggplot(reslt_acum) +
  #geom_area(aes(x = Date, y = tot, color = tot > 0)) +
  #geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue") +
  #geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  geom_col(aes(x = Date, y = ifelse(tot12m > 0, tot12m, 0)), fill = "blue") + 
  geom_col(aes(x = Date, y = ifelse(tot12m <= 0, tot12m, 0)), fill = "red") + 
  #linerange fica legal tb
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado (trilhões de R$") +
  scale_y_continuous(labels = function(x) {format(x/1000000, big.mark = ".", decimal.mark = ",")})


ggplot(reslt_acum) +
  #geom_area(aes(x = Date, y = tot, color = tot > 0)) +
  #geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue") +
  #geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  geom_col(aes(x = Date, y = ifelse(value > 0, value, 0)), fill = "blue") + 
  geom_col(aes(x = Date, y = ifelse(value <= 0, value, 0)), fill = "red") + 
  geom_line(aes(x = Date, y = tot12m, color = tot12m > 0, group = 1)) + #sem o group = 1 ele divide a linha
  #geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado (trilhões de R$") +
  scale_y_continuous(labels = function(x) {format(x/1000000, big.mark = ".", decimal.mark = ",")})



# PIB ---------------------------------------------------------------------

data_pib <- read_excel('./data/sh-rtn.xlsx', sheet = "2.1-A", skip = 4) %>%
  filter(Discriminação == "PIB Nominal (R$ Milhões)") %>%
  gather(-1, key = "year", value = "pib") %>%
  select(-1) %>%
  mutate(year = as.numeric(year))

data_correntes <- read_excel('./data/sh-rtn.xlsx', sheet = "1.1", skip = 4) %>%
  filter(Discriminação == "5. RESULTADO PRIMÁRIO GOVERNO CENTRAL - ACIMA DA LINHA (3 - 4)") %>%
  gather(-1, key = "Date", value = "value") %>%
  mutate(Date = as.Date(as.numeric(Date), origin = "1899-12-30")) %>%
  select(-1) %>%
  mutate(month = lubridate::month(Date),
         month_name = lubridate::month(Date, label = T),
         year = lubridate::year(Date))

result_pib <- data_correntes %>%
  left_join(data_pib, by = "year") %>%
  mutate(value_pib = value / pib)

reslt_acum_pib <- result_pib %>%
  mutate(
    tot = cumsum(value_pib),
    tot12m = zoo::rollsum(value_pib, k = 12, fill = NA, align = "right")
  )

result_anual_pib_verif <- read_excel('./data/sh-rtn.xlsx', sheet = "2.1-A", skip = 4) %>%
  filter(Discriminação == "5. RESULTADO PRIMÁRIO GOVERNO CENTRAL - ACIMA DA LINHA (3 - 4)") %>%
  gather(-1, key = "year", value = "result_ano") %>%
  select(-1) %>%
  mutate(year = as.numeric(year))

verif <- reslt_acum_pib %>%
  filter(month == 12) %>%
  select(tot12m, year) %>%
  left_join(result_anual_pib_verif) %>%
  mutate(verif = tot12m - result_ano)

sum(verif$verif)
#ok!

ggplot(reslt_acum_pib) +
  geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue") +
  geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado (trilhões de R$, IPCA)") +
  scale_y_continuous(labels = scales::percent) +
  theme_bw()

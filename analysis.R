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


result_scaled <- (result$value - min(result$value)) / (max(result$value) - min(result$value))

jsonlite::write_json(result_scaled, "result.json")


ggplot(result) + geom_histogram(aes(x = value), bins = 100)
ggplot(result) + geom_jitter(aes(x = value, y = 1, color = value)) + theme_minimal()

result_binned <- result %>% mutate(value_binned = cut(value, c(-Inf, -5e4, -2.5e4, 0, 2.5e4, 5e4, Inf), c("muito neg", "bem neg", "neg", "pos", "bem pos", "muito pos")))

ggplot(result_binned) + geom_jitter(aes(x = value, y = 1, color = value_binned)) + theme_minimal() + scale_color_discrete_diverging(palette = "Blue-Red")

ggplot(result_binned) + geom_tile(aes(x = month_name, y = year, fill = value_binned)) + scale_fill_discrete_diverging(palette = "Blue-Red")

ggplot(result_binned) + geom_tile(aes(x = month_name, y = year, fill = value)) +  scale_fill_gradient2(
  low = "firebrick",    # Color for negative values
  mid = "white",  # Color for zero
  high = "steelblue",  # Color for positive values
  midpoint = 0    # Set zero as the middle point
) + theme(legend.position = "none")

color_scale <- scales::gradient_n_pal(
  colours = c("#DC143C","white", "steelblue"),
  values = c(min(result$value), 0, max(result$value))  # Define the range of the data
)

color_scale <- scales::gradient_n_pal(
  colours = c("#DC143C", "#FFD1CE","#CFE6FF", "royalblue"),
  values = c(min(result$value), -1, 1, max(result$value))  # Define the range of the data
)

result_binned$colors <- color_scale(result_binned$value)

ggplot(result_binned) + geom_tile(aes(x = month_name, y = year, fill = colors)) +  scale_fill_identity()

jsonlite::write_json(result_binned$value_binned, "result-binned.json")
jsonlite::write_json(result_binned$colors, "colors.json")



ggplot(result, aes(x = Date, y = value)) +
  geom_col() +
  geom_point() +
  theme_minimal()



ggplot(result, aes(x = year, y = month_name, fill = -value))+
                   #fill = value > 0, alpha = abs(value))) +
  geom_tile(color = "white") +
  scale_fill_continuous_diverging(palette = "Blue-Red") +
  theme_minimal()

# hmm interessante
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
           alpha = 0, color = "tomato", fill = "transparent" ##B54B47
  ) +
  geom_vline(data = mudancas_governo, aes(xintercept = dates), size = .7, linetype = "dotted", color = "gray") + ##B58A47
  annotate(geom = "text", x = as.Date("2020-02-01"), y = value_fev_2020 + 5e4, hjust = "left", vjust = "bottom", label = "Pandemia", family = "Work Sans", size = 3, color = "tomato") + 
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado: 1997 a 2024", subtitle = "R$ trilhões - valores a preços de agosto de 2024 - IPCA", caption = "Fonte: STN / Série Histórica do Resultado do Tesouro Nacional, tabela 1.1-A, agosto de 2024") +
  scale_y_continuous(labels = function(x) {format(x/1000000, big.mark = ".", decimal.mark = ",")}) +
  theme_minimal() +
  theme(
    text = element_text(family = "Work Sans"),
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank(),
    axis.ticks.x = element_line(),
    plot.title = element_text(face = "bold"),
    plot.caption = element_text(face = "italic"),
    plot.background = element_rect(fill = "floralwhite")#rgb(245/255,240/255,230/255)
    )

ggsave("acumulado.png", width = 10, height = 6, bg = "white")

ggplot(reslt_acum) +
  #geom_area(aes(x = Date, y = tot, color = tot > 0)) +
  #geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue") +
  #geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  geom_col(aes(x = Date, y = ifelse(tot12m > 0, tot12m, 0)), fill = "blue") + 
  geom_col(aes(x = Date, y = ifelse(tot12m <= 0, tot12m, 0)), fill = "red") + 
  #linerange fica legal tb
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado 12m (trilhões de R$") +
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


result_export <- result %>%
  mutate(pandemia = ifelse(
    Date > lubridate::ymd("2020/02/01") & Date < lubridate::ymd("2021/07/01"), "Pandemia", ""
  )) %>%
  select(-Date)

jsonlite::write_json(result_export, "result.json")


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



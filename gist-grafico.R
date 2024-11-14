library(tidyverse)
library(readxl)
library(lubridate)
library(colorspace)
library(extrafont)
library(zoo)
library(ckanr)
loadfonts()

recurso_TT <- resource_show(id="527ccdb1-3059-42f3-bf23-b5e3ab4c6dc6",
                            url="http://www.tesourotransparente.gov.br/ckan")

download.file(recurso_TT$url, destfile = "./data/sh-rtn.xlsx", mode = 'wb' ) # ajustar o destino do arquivo...

raw_data <- read_excel('./data/sh-rtn.xlsx', sheet = "1.1-A", skip = 4) # aqui pego a planilha com os resultados atualizados pelo IPCA

data_010 <- raw_data %>% 
  gather(-1, key = "Date", value = "value") %>%
  mutate(Date = as.Date(as.numeric(Date), origin = "1899-12-30"))

result <- data_010 %>%
  filter(Discriminação == "5. RESULTADO PRIMÁRIO GOVERNO CENTRAL - ACIMA DA LINHA (3 - 4)") %>%
  select(-1) %>%
  mutate(month = lubridate::month(Date),
         month_name = lubridate::month(Date, label = T),
         year = lubridate::year(Date))

reslt_acum <- result %>%
  mutate(
    tot = cumsum(value),
    tot12m = zoo::rollsum(value, k = 12, fill = NA, align = "right"),
    tot48m = zoo::rollsum(value, k = 48, fill = NA, align = "right")
  )

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

ggplot(reslt_acum) +
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
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado: 1997 a 2024", subtitle = "R$ trilhões \u2014 valores a preços de setembro de 2024 \u2014 IPCA", caption = "Fonte: STN / Série Histórica do Resultado do Tesouro Nacional, tabela 1.1-A, setembro de 2024") +
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

ggsave("acumulado-set2.png", width = 25/3, height = 5, bg = "white", dpi = "print")

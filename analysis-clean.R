

library(ckanr)
library(tidyverse)
library(readxl)

recurso_TT <- resource_show(id="527ccdb1-3059-42f3-bf23-b5e3ab4c6dc6",
                            url="http://www.tesourotransparente.gov.br/ckan")
download.file(recurso_TT$url, destfile = "./data/sh-rtn.xlsx", mode = 'wb' )

raw_data <- read_excel('./data/sh-rtn.xlsx', sheet = "1.1-A", skip = 4)

library(lubridate)
library(colorspace)
library(extrafont)
library(zoo)
loadfonts()

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

value_min_12m <- min(reslt_acum$tot12m, na.rm = T)

ggplot(reslt_acum #%>% filter(Date <= as.Date("2023-12-31"))
       ) +
  geom_text(data = mudancas_governo, aes(label = presidentes, x = dates), y = 3e5, size = 2.5, hjust = "left", nudge_x = 50, family = "Work Sans") +
  geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot12m > 0, tot12m, 0)), fill = "steelblue", alpha = 1) +
  geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot12m <= 0, tot12m, 0)), fill = "firebrick") +
  annotate(geom = "rect",
           linetype = "dashed",
           xmin = lubridate::ymd("2020/02/01"),
           xmax = lubridate::ymd("2021/07/01"),
           ymin = 0, ymax = value_min_12m,
           alpha = 0, color = "black", fill = "transparent" ##B54B47
  ) +
  geom_vline(data = mudancas_governo, aes(xintercept = dates), size = .7, linetype = "dotted", color = "gray") + ##B58A47
  annotate(geom = "text", x = as.Date("2020-02-01"), y = value_min_12m - 1e4, hjust = "left", vjust = "top", label = "Pandemia", family = "Work Sans", size = 3, color = "tomato") + 
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado em 12 meses: 1997 a 2024", subtitle = "R$ bilhões \u2014 valores a preços de setembro de 2024 \u2014 IPCA", caption = "Fonte: STN / Série Histórica do Resultado do Tesouro Nacional, tabela 1.1-A, setembro de 2024") +
  scale_y_continuous(labels = function(x) {format(x/1000, big.mark = ".", decimal.mark = ",")}) +
  theme_minimal() +
  theme(
    text = element_text(family = "Work Sans"),
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank(),
    axis.ticks.x = element_line(),
    plot.title = element_text(face = "bold"),
    plot.caption = element_text(face = "italic"),
    plot.background = element_rect(fill = "white")#rgb(245/255,240/255,230/255)
  )

ggsave("acumulado12m-white.png", width = 25/3, height = 5, bg = "white", dpi = "print")

ggplot(reslt_acum) +
  geom_point(aes(y = month_name, x = year, size = abs(value), color = value > 0)) +
  scale_color_manual(values = c("TRUE" = "steelblue", "FALSE" = "firebrick")) +
  # scale_color_gradient2(
  #   low = "firebrick",    # Color for negative values
  #   mid = "white",  # Color for zero
  #   high = "steelblue",  # Color for positive values
  #   midpoint = 0    # Set zero as the middle point
  # ) + 
  labs(x = NULL, y = NULL) + theme_minimal() + 
  theme(
    text = element_text(family = "Work Sans"),
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank(),
    axis.ticks.x = element_line(),
    plot.title = element_text(face = "bold"),
    plot.caption = element_text(face = "italic"),
    legend.position = "none",
    #panel.background = element_rect(fill = "floralwhite"),
    plot.background = element_rect(fill = "white")#rgb(245/255,240/255,230/255)
  )

ggsave("grid.png", width = 25/3, height = 5, bg = "white", dpi = "print")

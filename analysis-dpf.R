library(tidyverse)
library(readxl)
library(lubridate)
library(colorspace)
library(extrafont)
library(zoo)
library(ckanr)


recurso_dpf_TT <- resource_show(id="0402cb77-5e4c-4414-966f-0e87d802a29a",
                                url="http://www.tesourotransparente.gov.br/ckan")
download.file(recurso_dpf_TT$url, destfile = "./data/dpf.xlsx", mode = 'wb' )
tabela_div <- read_excel("./data/dpf.xlsx", skip = 4)

meses_red <- c("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez")

dpf <- tabela_div %>%
  rename(rotulos = 1) %>%
  filter(str_detect(rotulos, "DPF EM PODER")) %>%
  select(-1) %>%
  gather(key = Mes_Ano, value = Valor) %>%
  separate(Mes_Ano, into = c("Mes", "Ano"), sep = "/") %>%
  filter(!is.na(Ano)) %>% # (3)
  mutate(Ano = as.integer(paste0('20', Ano)), # (4)
         Mes_num = match(Mes, meses_red),
         Periodo = as.Date(paste0(Ano, "-",
                                  if_else(Mes_num < 10, "0", ""), Mes_num, "-",
                                  "01")))


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

value_fev_2020 <- dpf %>% filter(Mes_num == 2, Ano == 2020) %>% .$Valor

ggplot(dpf) +
  geom_text(data = mudancas_governo, aes(label = presidentes, x = dates), y = 2.2*1000000, size = 2.5, hjust = "left", nudge_x = 50, family = "Work Sans") +
  geom_ribbon(aes(x = Periodo, ymin = 0, ymax = Valor), fill = "steelblue", alpha = 1) +
  annotate(geom = "rect",
           xmin = lubridate::ymd("2020/02/01"),
           xmax = lubridate::ymd("2021/07/01"),
           ymin = 0, ymax = value_fev_2020,
           alpha = 0, color = "tomato", fill = "transparent" ##B54B47
  ) +
  geom_vline(data = mudancas_governo, aes(xintercept = dates), size = .7, linetype = "dotted", color = "gray") + ##B58A47
  annotate(geom = "text", x = as.Date("2020-02-01"), y = value_fev_2020, hjust = "left", vjust = "bottom", label = "Pandemia", family = "Work Sans", size = 3, color = "tomato") + 
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Estoque da Dívida Pública Federal: 2000 a 2024", subtitle = "R$ trilhões \u2014 valores a preços de setembro de 2024 \u2014 IPCA", caption = "Fonte: STN / Série Histórica do Resultado do Tesouro Nacional, tabela 1.1-A, setembro de 2024") +
  scale_y_continuous(labels = function(x) {format(x/1000, big.mark = ".", decimal.mark = ",")}) +
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

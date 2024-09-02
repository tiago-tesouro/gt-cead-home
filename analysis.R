library(tidyverse)
library(readxl)
library(lubridate)
library(colorspace)
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

ggplot(reslt_acum) +
  geom_ribbon(aes(x = Date, ymin = 0, ymax = ifelse(tot > 0, tot, 0)), fill = "steelblue") +
  geom_ribbon(aes(x = Date, ymax = 0, ymin = ifelse(tot <= 0, tot, 0)), fill = "firebrick") +
  scale_x_date(date_breaks = "2 years", date_labels = "%Y") +
  labs(x = NULL, y = NULL, title = "Resultado primário acumulado (trilhões de R$, IPCA)") +
  scale_y_continuous(labels = function(x) {format(x/1000000, big.mark = ".", decimal.mark = ",")}) +
  theme_bw()

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

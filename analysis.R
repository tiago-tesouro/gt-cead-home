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
    tot12m = 
  )

ggplot(reslt_acum) +
  geom_line(aes(x = Date, y = value))

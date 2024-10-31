library(tidyverse)
library(jsonlite)

values <- jsonlite::read_json("./spiral/gaussian-test.json", simplifyVector = TRUE)

df <- data.frame(v = values)

ggplot(df) + geom_histogram(aes(x = v), bins = 50)
ggplot(df) + geom_density(aes(x = v))


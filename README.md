import streamlit as st
import numpy as np
import pandas as pd

# Page configuration
st.set_page_config(page_title="Smart Crop Recommendation", layout="centered")

# Title
st.title("🌾 Smart Crop Recommendation")

# User Inputs
temperature = st.slider("Temperature (°C)", 10, 45, 31)
rainfall = st.slider("Rainfall (mm)", 200, 3000, 1530)
season = st.selectbox("Season", ["Kharif", "Rabi", "Zaid"])

# Crop recommendation logic (rule-based for demo)
def recommend_crops(temp, rain, season):
    scores = {}

    if rain > 1200 and temp > 25:
        scores["Rice"] = 0.8
        scores["Sugarcane"] = 0.8
        scores["Maize"] = 0.4

    elif rain < 800 and temp > 20:
        scores["Millet"] = 0.7
        scores["Cotton"] = 0.6
        scores["Maize"] = 0.5

    else:
        scores["Wheat"] = 0.7
        scores["Barley"] = 0.6
        scores["Gram"] = 0.5

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Button
if st.button("Recommend"):
    recommendations = recommend_crops(temperature, rainfall, season)

    st.success("Top 3 Recommended Crops")

    for i, (crop, score) in enumerate(recommendations[:3], start=1):
        st.write(f"{i}. 🌱 **{crop}** — Score: {score}")

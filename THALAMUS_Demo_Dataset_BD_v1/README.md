# THALAMUS AI — Demo Business Dataset (Bangladesh Localized)

## Purpose
A small, coherent synthetic dataset for demonstrating the THALAMUS AI prototype,
localized for the Bangladeshi market.

The operational schema is inspired by the Olist Brazilian E-Commerce Public Dataset,
which contains separate tables for customers, orders, order items, payments, reviews,
products, sellers and related geolocation/category data. This Bangladeshi edition
preserves that schema while substituting Bangladesh-specific names, cities,
products, currencies and review language.

IMPORTANT:
- These CSVs are SYNTHETIC demo data generated for THALAMUS.
- They are NOT a redistributed copy of the Olist dataset.
- `inventory.csv` and `suppliers.csv` are intentionally synthetic extensions because the base Olist data is not a complete inventory-management dataset.
- All person names, cities, supplier names and product names have been regenerated to reflect a Bangladeshi context.
- Use this package to prototype reasoning, retrieval, agent routing, evidence, reports and approval workflows.

## Approximate scale
- 1,000 customers
- 100 products
- 40 sellers
- 12 suppliers
- 5,000 orders
- ~6,500 order items
- 5,000 payments
- ~3,500 reviews
- 12 months of order history

## Relationships
customers -> orders
orders -> order_items
order_items -> products
order_items -> sellers
orders -> payments
orders -> reviews
products -> inventory
inventory -> suppliers

## Six prototype agents
1. Sales Analyst
2. Marketing Agent
3. Inventory Agent
4. Customer Success
5. Finance Agent
6. Automation Agent (locked)

## Recommended first demo
Question:
"Why did revenue decline last month?"

The planner should retrieve relevant internal data, activate Sales Analyst and supporting agents,
synthesize evidence, produce a recommendation, and pass any proposed action through the policy/approval layer.

## Suggested version
Dataset version: 1.0.0
Generated deterministically with seed 42.

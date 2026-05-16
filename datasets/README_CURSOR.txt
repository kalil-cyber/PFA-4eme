TARIKI DATASET READY FOR CURSOR

Folder structure:
- CSV files = optimized for PostgreSQL import
- JSON files = optimized for API / frontend
- Each sheet from the original Excel was cleaned automatically

Recommended placement in project:

/datasets/

Example:
datasets/
  table_5_monday.csv
  table_6_tuesday.csv
  table_0_coordinates.csv

Backend import:
- Use csv-parser for CSV
- Use fs + JSON.parse for JSON

Recommended Node packages:
- csv-parser
- xlsx
- pg
- prisma or sequelize

This dataset is now normalized and easier for Cursor to parse.

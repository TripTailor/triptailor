#!/usr/bin/python

import psycopg2

b = 0.6

def get_total_dl(cur, location_id):
  cur.execute("select ha.freq from hostel_attribute ha, hostel h where ha.hostel_id = h.id and h.location_id = " + str(location_id))
  return sum(map(lambda row: row[0], cur.fetchall()))

try:
  conn = psycopg2.connect("dbname='triptailor' user='triptailor' host='localhost' password='hostels'")
except:
  print "Error connecting to database"

cur = conn.cursor()
cur.execute("select id from location where id in (1, 2)")
location_rows = cur.fetchall()

ratings = []

for location_row in location_rows:
  cur.execute("select id, name from hostel where location_id = " + str(location_row[0]))
  hostel_rows = cur.fetchall()

  avdl = get_total_dl(cur, location_row[0]) / len(hostel_rows)

  for hostel_row in hostel_rows:
    cur.execute("select cfreq, rating, freq from hostel_attribute where hostel_id = " + str(hostel_row[0]))
    metrics_rows = cur.fetchall()

    dl = sum(map(lambda row: row[2], metrics_rows))

    for metrics in metrics_rows:
      rating = (metrics[0] * metrics[1] / metrics[2]) / (1.0 - b + b * (dl / avdl))
      ratings.append(rating)

print (max(ratings) + 1)

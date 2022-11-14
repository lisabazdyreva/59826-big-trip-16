# Big Trip

Big Trip - is a modern web application for planning a trip. Service helps you to plan you trip in details, count the cost of jorney and get all needed information about sights. Minimalistic interface will help you to focus attention on the planning a trip. This application has everything a traveler can need.

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-screens.png "Big Trip change screen buttons")

There are 2 useful screens in the application: 

- travel itinerary,
- statistics.

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-list.png "Big Trip list of trip points")

On the travel itinerary screen user can view the list of trip point in chronological order by default. Also you can sort trip points by price and by duration or add/remove them from favorites (star button).

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-filtering.png "Big Trip filters for points")

User can see all finished events and all future events by selecting a filter in the header.

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-charts.png "Big Trip money chart")

If it is convenient for you to view information in the form of charts, you can go to statistics page and view all needed information. 

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-point.png "Big Trip add trip point form")

User can add trip point by clicking a button 'New Event'. There are available many types of event: train, ship, sighseeing, etc. The user must specify the city in which the event takes place. Also duration and price fileds are available to fill in. An interesting feature of every point is a possibility to add additional offers to point like breakfast, air conditioning. They are different for every type of point.

When the user selects a city, a brief description of that city appears below. Also photos are available for some cities in the gallery.

![Alt text](https://github.com/lisabazdyreva/big-trip/blob/master/.github/workflows/big-trip-header.png "Big Trip header")

In the header you can view the start trip city, the finishing trip city and the total price of all jorney. All this information is updating when you edit or remove points.


## Stack

- Vanilla JavaScript(es8),
- OOP-style,
- MVP,
- Webpack,
- chart.js,
- flatpickr,
- dayjs.

Requests to server and catching errors are implemented.

## Demo site

[Go to Big Trip application >>](https://big-trip-lisabazdyreva.vercel.app/)


## How to run app locally:


- Clone repository:
```bash
git clone git@github.com:lisabazdyreva/big-trip.git
```

- Install dependencies:

```bash
npm install
```

- Run application:
```bash
npm start
```

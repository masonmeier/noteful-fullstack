// hosted on Heroku using PostgreSQL db
export default {
	DATASOURCE: `postgresql`,
	API_ENDPOINT: `https://masonmeier-noteful-api.herokuapp.com/api`,
	POSTGRES_KEY: `postgres://swbzwnxvoldtsr:144b3100c62e0c84da64b5b4dfb50e25b8a67d54ec1494ad8ca434b28ac6d32a@ec2-52-202-146-43.compute-1.amazonaws.com:5432/dcc32gl03qe8vghttps://masonmeier-noteful-api.herokuapp.com/`,
	API_KEY: process.env.REACT_APP_API_KEY
};


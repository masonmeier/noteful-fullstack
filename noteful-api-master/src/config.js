module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'test',
	API_TOKEN: process.env.API_TOKEN || '1515',
	TEST_DATABASE_URL:
		process.env.TEST_DATABASE_URL || 'postgres://swbzwnxvoldtsr:144b3100c62e0c84da64b5b4dfb50e25b8a67d54ec1494ad8ca434b28ac6d32a@ec2-52-202-146-43.compute\n' +
		'-1.amazonaws.com:5432/dcc32gl03qe8vg\n/note-test',
	DATABASE_URL:
		process.env.DATABASE_URL || 'postgres://swbzwnxvoldtsr:144b3100c62e0c84da64b5b4dfb50e25b8a67d54ec1494ad8ca434b28ac6d32a@ec2-52-202-146-43.compute\n' +
		'-1.amazonaws.com:5432/dcc32gl03qe8vg\n/note'
};

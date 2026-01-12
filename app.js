import { Sequelize, DataTypes } from 'sequelize';

// step 1: Cpnnect to to DB
const sequelize = new Sequelize('courses_db', 'appuser', 'apppass', {
    host: '127.0.0.1',
    dialect: 'mysql'              
});

// step 2: Model of table - How course table look?.
const Course = sequelize.define('Course', {
    // Columns of the table
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'courses',    // 
    timestamps: false        // make shure only thoes columns only created
});

// step 3: the logic functions
// init DB
async function createDbAndTables() {
    try {
        await sequelize.authenticate();           // Check name and password correct
        await sequelize.sync();                   // Creating table if not exists
        console.log("Database and tables are ready.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

// insert info
async function addCourse(name, hours, is_active = true) {
    try {
        const newCourse = await Course.create({
            name: name,
            hours: hours,
            is_active: is_active
        });
        console.log(`Added course with id=${newCourse.id}`);
    } catch (error) {
        console.error("Error adding course:", error);
    }
}

// get all (findall = select * from)
async function getActiveCourses() {
    const activeCourses = await Course.findAll({
        where: {
            is_active: true
        }
    });
    return activeCourses;
};

// step 4: Main

(async () => {
    try {
        // create the table
        await createDbAndTables();
        // add info
        await addCourse("SQL", 20, true);
        await addCourse("JavaScript", 30, true);
        await addCourse("NestJS", 10, false);
        // get info
        const courses = await getActiveCourses();
        console.log("Active courses:");
        courses.forEach(course => {
            console.log(`${course.id}: ${course.name} (${course.hours} hours) active=${course.is_active}`);
        });

    } catch (error) {
        console.error("Error in main:", error);
    } finally {
        await sequelize.close();
    }
});
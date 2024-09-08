import { useLocation } from 'react-router-dom';
import Message from '../layout/Message';
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import styles from '../pages/Projects.module.css';
import ProjectCard from '../project/ProjectCard';
import { useState, useEffect } from 'react';
import Loader from '../layout/Loader';


function Projects() {
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState();

    const location = useLocation()

    let message = ''
    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch("http://localhost:5000/projects", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(resp => resp.json())
                .then((data) => {
                    console.log(data);
                    setProjects(data);
                    setRemoveLoading(true)
                })
                .catch((err) => console.log(err));
        }, 1000)
    }, []);

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Projeto não cadastrado!');
                }
                return resp.json();
            })
            .then(() => {

                setProjects(projects.filter(project => project.id !== id));
                setProjectMessage("Projeto removido com sucesso!")
            })
            .catch(err => console.error('Error:', err));
    }


    return (
        <div className={styles.Project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                    ))
                }
                {!removeLoading && <Loader />}
                {removeLoading && projects.length === 0 &&
                    <p> Não há projetos cadastrados!</p>
                }
            </Container>
        </div>
    );

}

export default Projects
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button';
import Form from '../../../components/Form';
import InputRoot from '../../../components/input-root';
import InputText from '../../../components/input-text';
import Span from '../../../components/Span';
import { saveService } from '../../../services/save-service';
import Div from '../../../components/div';
import { usePageContext } from '../../../contexts/page-context';
import { IAppFileRequest } from '../../../interfaces/IAppFileRequest';

function Add() {
  const navigate = useNavigate()
  const pageContext = usePageContext();

  const formSchema = z.object({
    name: z.string().nonempty("Campo obrigatório"),
    path: z.string().nonempty("Campo obrigatório")
  })

  const { handleSubmit, formState: { errors }, register } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
    }
  );

  function handleAddSave(data: z.infer<typeof formSchema>) {
    const saveItem: IAppFileRequest = {
      name: data.name,
      observer: false,
      path: data.path,
      versionControl: false,
      autoValidateSync: false
    }

    saveService.add(saveItem)
      .then(e => {
        navigate("/")
      })
  }

  useEffect(() => {
    pageContext.setContextPage({ pageTitle: 'Add' });
  }, [pageContext.setContextPage]);

  return (
    <Div variation="in-center">
      <Div variation='in-center-content' className='bg-zinc-900 bg-opacity-50'>
        <Form onSubmit={handleSubmit(handleAddSave)}>
          <InputRoot>
            <InputText {...register("name")} variation='default-full' placeholder='Save name' />
            <Span variation='error'>{errors.name?.message}</Span>
          </InputRoot>
          <InputRoot>
            <InputText {...register("path")} variation='default-full' placeholder='Save path' />
            <Span variation='error'>{errors.name?.message}</Span>
          </InputRoot>
          <Button>Save</Button>
        </Form>
      </Div>
    </Div>
  )
}

export default Add